<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;

class Context
{

    /**
     * @var ProjectStatusManager
     */
    private ProjectStatusManager $projectStatusManager;

    /**
     * @var ProjectManager
     */
    private ProjectManager $projectManager;

    /**
     * @var Config
     */
    private Config $config;

    /**
     * @var DateStatus[]
     */
    private array $dateStatuses = [];

    /**
     * @var array
     */
    private array $dateStatusesGroupBySprint = [];

    /**
     * Context constructor.
     * @param  ProjectStatusManager  $projectStatusManager
     * @param  ProjectManager  $projectManager
     * @param  Config  $config
     */
    public function __construct(ProjectStatusManager $projectStatusManager, ProjectManager $projectManager, Config $config)
    {
        $this->projectStatusManager = $projectStatusManager;
        $this->projectManager = $projectManager;
        $this->config = $config;
    }

    public function createSimpleDateStatuses()
    {
        $startDate = $this->config->getStartDate();
        $holidays = $this->config->getHolidays();

        // 素直に日毎にで各プロジェクトの割当比率を算出
        $i = 0;
        while (true) {
            if ($this->projectStatusManager->areAllTaskAssigned()) {
                break;
            }

            $nextDate = $startDate->addDays($i);
            $dayOfWeek = $nextDate->dayOfWeek;
            if (in_array($dayOfWeek, $holidays)) {
                $i++;
                continue;
            }

            $this->_createSimpleDateStatuses($nextDate);

            $i++;
        }

//        var_dump($this->dateStatuses);
//        var_dump($this->projectStatusManager->getProjectStatuses());

        // 全てのタスクを完了できないまま期限に到達してしまったプロジェクトに、
        // 期限までに終了する係数を算出して、日毎の割当ポイントを算出

        foreach ($this->dateStatuses as $dateStatus) {
            /** @var DateProjectStatus $dateProjectStatus */
            foreach ($dateStatus->getDateProjectStatuses() as $dateProjectStatus) {
                $projectStatus = $this->projectStatusManager->getProjectStatus($dateProjectStatus->getSlug());
                if ($projectStatus->getCompressCoef() == 1) {
                    continue;
                }
                $dateProjectStatus->updateCompressPoint($projectStatus->getCompressCoef());
            }
        }

        $this->groupBySprint();
        var_dump(array_keys($this->dateStatusesGroupBySprint));
//        var_dump($this->dateStatusesGroupBySprint);
//        var_dump($this->projectStatusManager->getProjectStatuses());
//        var_dump($this->dateStatuses);
    }

    private function _createSimpleDateStatuses(CarbonImmutable $theDate)
    {
        // タスクが完了している（固定タスクも含む）プロジェクトの割当を他のプロジェクトに配分
        $this->computeCurrentRatio($theDate);

        // 固定タスクの工数合計を取得して、1日の稼働可能工数から引く
        // 稼働可能工数でタスクを割り当てしていく

        // 指定された日の固定タスクを取得
        $staticTasks = collect($this->projectManager->getStaticTasks())
            ->filter(
                fn(Task $staticTask) => in_array($theDate->dayOfWeek, $staticTask->getDays())
            );

        // 固定タスクの工数合計
        $staticTaskTotalPoint = $staticTasks->reduce(
            fn($sum, Task $task) => $sum + $task->getPoint(), 0);

        // 1日の稼働可能工数
        $limitPoint = $this->config->getOneDayAbilityPoint() - $staticTaskTotalPoint;

        $dateStatus = new DateStatus($theDate, $limitPoint);

        /** @var ProjectStatus $projectStatus */
        foreach ($this->projectStatusManager->getProjectStatuses() as $projectStatus) {
            if ($projectStatus->isAssigned()) {
                continue;
            }

            // プロジェクトの割当比率で稼働可能工数を算出
            $point = $projectStatus->getCurrentRatio()
                ? $projectStatus->computePointWithRatio($limitPoint, false)
                : 0;

            $compressPoint = $projectStatus->getCurrentRatio()
                ? $projectStatus->computePointWithRatio($limitPoint, true)
                : 0;

            $dateProjectStatus = new DateProjectStatus(
                $projectStatus->getSlug(),
                $projectStatus->getCurrentRatio(),
                $point,
                $compressPoint
            );

            $dateStatus->addDateProjectStatus($dateProjectStatus);
            $projectStatus->addAllocatedTotalPoint($point);

            // 割り当て済みフラグを立たせるかチェック
            $project = $this->projectManager->getProject($projectStatus->getSlug());
            if ($project->getEndDate() && $project->getEndDate()->lte($theDate)) {
                $projectStatus->assigned();
            }
        }

        $this->dateStatuses[$theDate->format('Y-m-d')] = $dateStatus;
    }

    public function computeCurrentRatio(CarbonImmutable $theDate)
    {
        // プロジェクトで新しく完了しているものがあれば、
        // 完了したプロジェクトの割当分を別のプロジェクトに再配分

        /** @var ProjectStatus $projectStatus */
        foreach ($this->projectStatusManager->getProjectStatuses() as $projectStatus) {
            if ($projectStatus->isAssigned()) {
                continue;
            }

            $project = $this->projectManager->getProject($projectStatus->getSlug());
            if ($project->getEndDate() && $project->getEndDate()->lte($theDate)) {
                $projectStatus->assigned();
            }
        }

        $totalUnusedRatio = $this->projectStatusManager->totalRatioOfProjectsAreAssigned();

        $projectCountHavingTaskToBeAssigned = $this->projectStatusManager
            ->findAllProjectHavingTaskToBeAssigned()
            ->count();

        if ($projectCountHavingTaskToBeAssigned === 0) {
            return;
        }

        $surplus = bcdiv($totalUnusedRatio, $projectCountHavingTaskToBeAssigned, 3);

        $this->projectStatusManager
            ->getProjectStatuses()
            ->filter(fn(ProjectStatus $projectStatus) => !$projectStatus->isAssigned())
            ->map(fn(ProjectStatus $projectStatus) => $projectStatus->currentRatio($surplus));
    }

    public function groupBySprint(): array
    {
        $group = [];

        $sprint = $this->config->getSprint();
        $sprintCoef = ($sprint - 1) * 7;

        $date = key($this->dateStatuses);
        $dt = CarbonImmutable::parse($date);
        $start = $dt->startOfWeek()->format('Y-m-d');
        $end = $dt->addDays($sprintCoef)->endOfWeek()->format('Y-m-d');
        $group["${start}_${end}"] = [];

        foreach ($this->dateStatuses as $date => $dateStatus) {
            $range = array_key_last($group);
            list($start, $end) = explode('_', $range);
            $start = CarbonImmutable::parse($start);
            $end = CarbonImmutable::parse($end);

            $dt = CarbonImmutable::parse($date);
            if (!$dt->between($start, $end)) {
                $dt = CarbonImmutable::parse($date);
                $start = $dt->startOfWeek()->format('Y-m-d');
                $end = $dt->addDays($sprintCoef)->endOfWeek()->format('Y-m-d');
            } else {
                $start = $start->format('Y-m-d');
                $end = $end->format('Y-m-d');
            }
            $group["${start}_${end}"][] = $dateStatus;
        }

        return $this->dateStatusesGroupBySprint = $group;
    }

    /**
     * @return ProjectStatusManager
     */
    public function getProjectStatusManager(): ProjectStatusManager
    {
        return $this->projectStatusManager;
    }

    /**
     * @return DateStatus[]
     */
    public function getDateStatuses(): array
    {
        return $this->dateStatuses;
    }

    /**
     * @return array
     */
    public function getDateStatusesGroupBySprint(): array
    {
        return $this->dateStatusesGroupBySprint;
    }

}
