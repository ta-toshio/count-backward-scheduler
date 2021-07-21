<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class TaskStatusManager
{

    private array $tasks = [];

    private function __construct() {}

    /**
     * @param  array  $tasks
     * @param  ProjectStatusManager  $projectStatusManager
     * @return static
     */
    public static function createFromTasks(array $tasks, ProjectStatusManager $projectStatusManager): static
    {
        $self = new static();

        /** @var Task $task */
        foreach ($tasks as $task) {
            $projectStatus = $projectStatusManager->getProjectStatus($task->getProject()->getSlug());
            $compressPoint = Calculator::floatDiv($task->getPoint(), $projectStatus->getCompressCoef(), 4);
            $stretchPoint = Calculator::floatMul($task->getPoint(), $projectStatus->getCompressCoef());

            $self->addTask(
                new TaskStatus(
                    $task,
                    $task->getProject()->getSlug(),
                    $task->getTitle(),
                    $task->getPoint(),
                    $compressPoint,
                    $stretchPoint,
                    $projectStatus->getCompressCoef()
                )
            );
        }

        return $self;
    }

    public function getFreeTasks(string $projectSlug): Collection
    {
        return $this->getTasks()
            ->filter(fn(TaskStatus $taskStatus) =>
                $taskStatus->getProjectSlug() === $projectSlug
                && !$taskStatus->isAssigned()
                && empty($taskStatus->getTask()->getDays())
            );
    }

    public function getStaticTasks(): Collection
    {
        return $this->getTasks()
            ->filter(fn(TaskStatus $taskStatus) => $taskStatus->getTask()->isStatic());
    }

    /**
     * @param  CarbonImmutable  $theDate
     * @return Collection
     */
    public function getStaticTasksWithin(CarbonImmutable $theDate): Collection
    {
        return $this->getStaticTasks()
            ->filter(
                fn(TaskStatus $taskStatus) =>
                in_array($theDate->dayOfWeek, $taskStatus->getTask()->getDays())
            )
            ->filter(function (TaskStatus $taskStatus) use ($theDate) {
                $startDate = $taskStatus->getTask()->getStartDate();
                $endDate = $taskStatus->getTask()->getEndDate();

                if ($startDate && $endDate) {
                    return $theDate->between($startDate, $endDate);
                }
                if ($startDate) {
                    return $theDate->gte($startDate);
                }
                if ($endDate) {
                    return $theDate->lte($endDate);
                }
                return true;
            });
    }

    /**
     * @param  TaskStatus  $taskStatus
     * @return $this
     */
    public function addTask(TaskStatus $taskStatus): static
    {
        $this->tasks[] = $taskStatus;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getTasks(): Collection
    {
        return collect($this->tasks);
    }

}
