<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
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
    public function __construct(
        ProjectStatusManager $projectStatusManager,
        ProjectManager $projectManager,
        Config $config
    ) {
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

        // 全てのタスクを完了できないまま期限に到達してしまったプロジェクトに、
        // 期限までに終了する係数を算出して、日毎の割当ポイントを算出

        foreach ($this->dateStatuses as $dateStatus) {
            /** @var DateProjectStatus $dateProjectStatus */
            foreach ($dateStatus->getDateProjectStatuses() as $dateProjectStatus) {
                $projectStatus = $this->projectStatusManager->getProjectStatus($dateProjectStatus->getSlug());
                if ($projectStatus->getCompressCoef() == 1) {
                    continue;
                }
                $dateProjectStatus
                    ->updateStretchPoint($projectStatus->getCompressCoef());
            }
        }

        $this->groupBySprint();
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

        $reallocate = false;
        $surplus = 0;

        /** @var ProjectStatus $projectStatus */
        foreach ($this->projectStatusManager->getProjectStatuses() as $projectStatus) {
            if ($projectStatus->isAssigned()) {
                continue;
            }

            // プロジェクトの割当比率で稼働可能工数を算出
            $point = $projectStatus->getCurrentRatio()
                ? $projectStatus->computePointWithRatio($limitPoint)
                : 0;

            if ($point > $projectStatus->getLeftPoint()) {
                $reallocate = true;
                $surplus += $point - $projectStatus->getLeftPoint();
                $point = $projectStatus->getLeftPoint();
            }

            $dateProjectStatus = new DateProjectStatus(
                $projectStatus->getSlug(),
                $projectStatus->getCurrentRatio(),
                $point,
                $point
            );

            $dateStatus->addDateProjectStatus($dateProjectStatus);
            $projectStatus->addAllocatedTotalPoint($point);

            // 割り当て済みフラグを立たせるかチェック
            $project = $this->projectManager->getProject($projectStatus->getSlug());
            if ($project->getEndDate() && $project->getEndDate()->lte($theDate)) {
                $projectStatus->assigned();
            }
        }

        if ($reallocate) {
            $this->computeCurrentRatio($theDate);
            $this->reallocateSurplusPoint($surplus, $dateStatus);
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

            if ($projectStatus->getAllocatedTotalPoint() >= $projectStatus->getTotalPoint()) {
                $projectStatus->assigned();
            }

            $project = $this->projectManager->getProject($projectStatus->getSlug());
            if ($project->getEndDate() && $project->getEndDate()->lte($theDate)) {
                $projectStatus->assigned();
            }

            if (!$theDate->between($projectStatus->getStart(), $projectStatus->getEnd())) {
                $projectStatus->setCurrentRatio(0);
            }
        }

        // 割当済みのプロジェクトの割当比率を分配
        $totalRatio = $this->projectStatusManager
            ->findAllProjectHavingTaskToBeAssigned($theDate)
            ->reduce(fn($acc, ProjectStatus $projectStatus) => $acc + $projectStatus->getRatio(), 0);

        $this->projectStatusManager
            ->findAllProjectHavingTaskToBeAssigned($theDate)
            ->map(function (ProjectStatus $projectStatus) use ($totalRatio) {
                return $projectStatus->setCurrentRatio(
                    round($projectStatus->getRatio() / $totalRatio * 100, 3)
                );
            });
    }

    public function reallocateSurplusPoint(float $surplus, DateStatus $dateStatus)
    {
        // 割当ポイントより残ポイントが少なかった場合の、余ったポイントを、他の有効なプロジェクトに再分配
        $dateStatus->getDateProjectStatuses()
            ->filter(fn(DateProjectStatus $dateProjectStatus
            ) => !$this->projectStatusManager->getProjectStatus($dateProjectStatus->getSlug())->isAssigned())
            ->map(function (DateProjectStatus $dateProjectStatus) use ($surplus) {
                $ratio = $this->projectStatusManager
                    ->getProjectStatus($dateProjectStatus->getSlug())
                    ->getCurrentRatio();
                $p = $dateProjectStatus->getPoint() + Calculator::floatMul($surplus, $ratio / 100);
                $s = $dateProjectStatus->getStretchPoint() + Calculator::floatMul($surplus, $ratio / 100);
                // @TODO currentRatioの値がsurplus分加えられることによって増える
                return $dateProjectStatus
                    ->setPoint($p)
                    ->setStretchPoint($s);
            });
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
     * @return ProjectManager
     */
    public function getProjectManager(): ProjectManager
    {
        return $this->projectManager;
    }

    /**
     * @return Config
     */
    public function getConfig(): Config
    {
        return $this->config;
    }

    /**
     * @return DateStatus[]
     */
    public function getDateStatuses(): array
    {
        return $this->dateStatuses;
    }

    /**
     * @param  string  $key
     * @return DateStatus|null
     */
    public function getDateStatus(string $key): ?DateStatus
    {
        return $this->dateStatuses[$key] ?? null;
    }

    /**
     * @return array
     */
    public function getDateStatusesGroupBySprint(): array
    {
        return $this->dateStatusesGroupBySprint;
    }

}
