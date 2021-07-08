<?php


namespace App\Domains\Models\Allocators;


use App\Domains\Models\Context;
use App\Domains\Models\DateProjectStatus;
use App\Domains\Models\DateStatus;
use App\Domains\Models\DateTask;
use App\Domains\Models\SprintProjectStatus;
use App\Domains\Models\SprintProjectStatusManager;
use App\Domains\Models\Task;
use App\Domains\Models\TaskStatus;
use App\Domains\Models\TaskStatusManager;
use App\Miscs\Calculator;
use Carbon\CarbonImmutable;

class SeriesAllocator implements AllocatorInterface
{
    use AllocatorTrait;

    const ID = 'series';

    private Context $context;
    private TaskStatusManager $taskStatusManager;

    public function __construct(Context $context, TaskStatusManager $taskStatusManager)
    {
        $this->context = $context;
        $this->taskStatusManager = $taskStatusManager;
    }

    public function handle()
    {
        $dateStatusesGroupBySprint = $this->context->getDateStatusesGroupBySprint();
        $acc = 0;
//        foreach ($dateStatusesGroupBySprint as $sprint => $dateStatuses) {
//            var_dump('-------------------');
//            var_dump($sprint);
//            /** @var DateStatus $dateStatus */
//            foreach ($dateStatuses as $dateStatus) {
//                /** @var DateProjectStatus $dateProjectStatus */
//                foreach ($dateStatus->getDateProjectStatuses() as $dateProjectStatus) {
//                    if ($dateProjectStatus->getSlug() === 'search-brand') {
//                        $acc += $dateProjectStatus->getPoint();
//                        var_dump(
//                            $dateProjectStatus->getPoint()
//                            . ' '
//                            . $acc
//                        );
//                    }
//                }
//            }
//        }
//        var_dump($acc);

        $acc = 0;
        $dateTasks = [];
        foreach ($dateStatusesGroupBySprint as $sprint => $dateStatuses) {

            // スプリント期間内で各プロジェクトの合計を算出
            list($start, $end) = explode('_', $sprint);
            $sprintProjectStatusManager = $this->createSprintProjectStatusManager($start, $end, $dateStatuses);
//            var_dump('------------------');
//            var_dump($sprint);
//            /** @var SprintProjectStatus $sprintProjectStatus */
//            foreach ($sprintProjectStatusManager->getSprintProjectStatuses() as $sprintProjectStatus) {
//                var_dump(
//                    $sprintProjectStatus->getProjectSlug() . ' ' .
//                    $sprintProjectStatus->getPoint() . ' ' .
//                    $sprintProjectStatus->getStretchPoint()
//                );
//            }

            $startDate = current($dateStatuses)->getDate();
            $endDate = last($dateStatuses)->getDate();
//            var_dump($startDate->format('Y-m-d'));

            // 算出したポイント分のタスク(TaskStatus)を取得
            // SprintProjectStatusのTaskStatusに格納
            /** @var SprintProjectStatus $sprintProjectStatus */
            foreach ($sprintProjectStatusManager->getSprintProjectStatuses() as $sprintProjectStatus) {
//                var_dump('-----------------');
//                var_dump($sprintProjectStatus->getProjectSlug());
//                var_dump($sprintProjectStatus->getPoint());
//                var_dump($sprintProjectStatus->getStretchPoint());
//                if ($startDate->format('Y-m-d') === '2021-11-22') {
//                    var_dump($sprintProjectStatus->getProjectSlug());
//                    var_dump($sprintProjectStatus->getPoint());
//                    var_dump($sprintProjectStatus->getStretchPoint());
//                }
                $sprintProjectStatus->setTasksForPoint($this->taskStatusManager);
            }

//            var_dump('------------------');
//            var_dump($sprint);
//            foreach ($sprintProjectStatusManager->getSprintProjectStatuses() as $sprintProjectStatus) {
//                /** @var TaskStatus $taskStatus */
//                if ($sprintProjectStatus->getProjectSlug() === 'search-brand') {
//                    var_dump($sprintProjectStatus->getPoint());
//                }
//                foreach ($sprintProjectStatus->getTaskStatuses() as $taskStatus) {
////                    if ($taskStatus->getProjectSlug() === 'code-index') {
////                        $acc += $taskStatus->getPoint();
////                        var_dump($taskStatus->getPoint() . ' ' . $acc);
////                    }
//                    if ($taskStatus->getProjectSlug() === 'search-brand') {
//                        $acc += $taskStatus->getPoint();
//                        var_dump($taskStatus->getTitle() . ' ' . $taskStatus->getCompressPoint() . ' ' . $acc);
//                    }
//                }
//                var_dump($acc);
//            }

            // DateTaskを生成
            // DateTaskにSprintProjectStatusのTaskStatusを利用してTaskを割り当てていく
            // TaskStatusは割り当てたら割り当て済みにする
//            if ($startDate->format('Y-m-d') === '2021-10-25') {
//                foreach ($sprintProjectStatusManager->getSprintProjectStatuses() as $sprintProjectStatus) {
//                    var_dump($sprintProjectStatus->getProjectSlug());
//                    /** @var TaskStatus $taskStatus */
//                    foreach ($sprintProjectStatus->getTaskStatuses() as $taskStatus) {
//                        var_dump($taskStatus->getTitle());
//                        var_dump($taskStatus->getCompressPoint());
//                    }
//                }
//            }
            $i = 0;
            while (true) {
                $theDate = $startDate->addDays($i);
                $dateStatus = $this->context->getDateStatus($theDate->format('Y-m-d'));
                $dateTasks[] = $dateTask = new DateTask(
                    $theDate,
                    $dateStatus->getLimitPoint()
                );
                $this->assign($dateTask, $sprintProjectStatusManager);

                if ($theDate->gte($endDate)) {
                    break;
                }
                $i++;
            }

//            if ($end === '2021-08-01') {
//                exit;
//            }
        }

        foreach ($dateTasks as $dateTask) {
            var_dump('------------');
            var_dump($dateTask->getDate()->toDateTimeLocalString());
            /** @var Task $task */
            foreach ($dateTask->getTasks() as $task) {
//                if ($task->getProject()->getSlug() !== 'search-brand') {
//                    continue;
//                }
                var_dump($task->getProject()->getSlug() .
                    ' '.
                    $task->getTitle() .
                    ' '.
                    $task->getPoint() .
                    ' ' .
                    $task->getAllocatedPoint());
            }
        }

//        var_dump('');
//        var_dump('');
//        var_dump('');
//        var_dump('');
//        var_dump('');
//        $acc = 0;
//        foreach ($dateTasks as $dateTask) {
//            var_dump('------------');
//            var_dump($dateTask->getDate()->toDateTimeLocalString());
//            /** @var Task $task */
//            foreach ($dateTask->getTasks() as $task) {
//                if ($task->getProject()->getSlug() === 'code-index') {
//                    var_dump($task->getProject()->getSlug() .
//                        ' '.
//                        $task->getTitle() .
//                        ' ' .
//                        $task->getPoint() .
//                        ' ' .
//                        $task->getAllocatedPoint());
//                    $acc += $task->getAllocatedPoint();
//                }
//            }
//        }
//        var_dump($acc);
    }

    public function assign(DateTask $dateTask, SprintProjectStatusManager $sprintProjectStatusManager, $depth = 0)
    {
        $depth++;
        if ($depth > 10) {
            return;
        }

        $taskStatus = $this->getNextTask($sprintProjectStatusManager);
        if (!$taskStatus) {
//            /** @var Task $task */
//            foreach ($dateTask->getTasks() as $task) {
//                var_dump($task->getTitle() . ' ' . $task->getPoint() . ' ' . $task->getAllocatedPoint());
//            }
            return;
        }


        $sprintProjectStatus = $sprintProjectStatusManager->getSprintProjectStatus($taskStatus->getProjectSlug());

            // タスクの残ポイント
            $pointToBeConsumed = $taskStatus->getLeftCompressPoint();

            // タスク残ポイントがプロジェクト残タスクより上だったら
            // 消化されるポイントはプロジェクトの残ポイント
            if ($pointToBeConsumed > $sprintProjectStatus->getLeftPoint()) {
                $pointToBeConsumed = $sprintProjectStatus->getLeftPoint();
            }

            $leftDatePoint = $dateTask->getLeftPoint();
            if ($pointToBeConsumed >= $leftDatePoint) {
                // タスク残ポイントが1日残ポイントより上だったらタスクに1日残ポイント分を割り当てて終了

                $task = $taskStatus
                    ->cloneTask()
                    ->setDate($dateTask->getDate())
                    ->setAllocatedPoint($taskStatus->computeStretchPoint($leftDatePoint));
                $dateTask
                    ->addAllocatedPoint($leftDatePoint)
                    ->addTask($task)
                    ->assigned();
                $taskStatus
                    ->addAllocatedCompressPoint($leftDatePoint);
                $sprintProjectStatus
                    ->addAllocatedPoint($leftDatePoint);

            } else if ($taskStatus->getLeftCompressPoint() > $sprintProjectStatus->getLeftPoint()) {
                // スプリント間の割当可能ポイントを超えてしまった場合、残った可能なポイントだけ割当する。
                // 1日残ポイントはまだ残っているので再度assignする
                $task = $taskStatus
                    ->cloneTask()
                    ->setDate($dateTask->getDate())
                    ->setAllocatedPoint($taskStatus->computeStretchPoint($pointToBeConsumed));
                $dateTask
                    ->addAllocatedPoint($pointToBeConsumed)
                    ->addTask($task);
                $taskStatus
                    ->addAllocatedCompressPoint($pointToBeConsumed);
                $sprintProjectStatus
                    ->addAllocatedPoint($pointToBeConsumed);

                $this->assign($dateTask, $sprintProjectStatusManager, $depth);

            } else {
                // タスク残ポイントが1日残ポイントより下だったらタスク残ポイントを割り当てて再度assignをする

                $task = $taskStatus
                    ->cloneTask()
                    ->setDate($dateTask->getDate())
                    ->setAllocatedPoint($taskStatus->computeStretchPoint($pointToBeConsumed));
                $dateTask
                    ->addAllocatedPoint($pointToBeConsumed)
                    ->addTask($task);
                $taskStatus
                    ->addAllocatedCompressPoint($pointToBeConsumed)
                    ->assigned();
                $sprintProjectStatus
                    ->addAllocatedPoint($pointToBeConsumed);

                $this->assign($dateTask, $sprintProjectStatusManager, $depth);
            }
    }

    /**
     * @param  SprintProjectStatusManager  $sprintProjectStatusManager
     * @return TaskStatus|null
     */
    private function getNextTask(SprintProjectStatusManager $sprintProjectStatusManager): ?TaskStatus
    {
        /** @var SprintProjectStatus $sprintProjectStatus */
        foreach ($sprintProjectStatusManager->getSprintProjectStatuses() as $sprintProjectStatus) {
            if ($sprintProjectStatus->getLeftPoint() <= 0) {
//                if ($sprintProjectStatus->getProjectSlug() === 'code-index') {
//                    var_dump($sprintProjectStatus->getPoint());
//                }
                continue;
            }
            $taskStatus = $sprintProjectStatus->findFirstFreeTask();
            if ($taskStatus) {
                return $taskStatus;
            }
        }
        return null;
    }

    private function getNextProject()
    {
    }

    public function support(string $identifier): bool
    {
        return $identifier === static::ID;
    }

}
