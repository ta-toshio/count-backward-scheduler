<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
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
            $compressPoint = Calculator::floatDiv($task->getPoint(), $projectStatus->getCompressCoef());
            $stretchPoint = Calculator::floatMul($task->getPoint(), $projectStatus->getCompressCoef());

            $self->addTask(
                new TaskStatus(
                    $task,
                    $task->getProject()->getSlug(),
                    $task->getTitle(),
                    $task->getPoint(),
                    $compressPoint,
                    $stretchPoint,
                    $projectStatus->getCompressCoef(),
                    $task->getVolume(),
                    $task->getDays()
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
                && empty($taskStatus->getDays())
            );
    }

    /**
     * @param  string  $projectSlug
     * @return TaskStatus|null
     */
    public function findFirstFreeTask(string $projectSlug): ?TaskStatus
    {
        return $this->getTasks()
            ->filter(fn(TaskStatus $taskStatus) =>
                $taskStatus->getProjectSlug() === $projectSlug && !$taskStatus->isAssigned())
            ->first();
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
