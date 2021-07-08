<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Illuminate\Support\Collection;

class SprintProjectStatus
{

    private string $projectSlug;
    private float $point;
    private float $stretchPoint;
    private float $allocatedPoint = 0;
    private array $taskStatuses = [];

    public function __construct(
        string $projectSlug,
        float $point,
        float $stretchPoint
    )
    {
        $this->projectSlug = $projectSlug;
        $this->point = $point;
        $this->stretchPoint = $stretchPoint;
    }

    public function findFirstFreeTask()
    {
        return $this->getTaskStatuses()
            ->filter(fn(TaskStatus $taskStatus) => !$taskStatus->isAssigned())
            ->first();
    }

    /**
     * @param  TaskStatusManager  $taskStatusManager
     * @return Collection
     */
    public function setTasksForPoint(TaskStatusManager $taskStatusManager): Collection
    {
        $accumulated = 0;

        /** @var TaskStatus $taskStatus */
        foreach ($taskStatusManager->getFreeTasks($this->projectSlug) as $taskStatus) {
            $this->addTaskStatus($taskStatus);

            $accumulated = Calculator::floatAdd($accumulated, $taskStatus->getLeftCompressPoint());
            if ($accumulated >= $this->point) {
                break;
            }
        }
        return $this->getTaskStatuses();
    }

    public function getTotalTaskStatusPoint(): array
    {
        $point = $this->getTaskStatuses()
            ->reduce(
                fn(float $accumulated, TaskStatus $taskStatus) =>
                    Calculator::floatAdd($accumulated, $taskStatus->getPoint()),
                0
            );

        $compressPoint = $this->getTaskStatuses()
            ->reduce(
                fn(float $accumulated, TaskStatus $taskStatus) =>
                Calculator::floatAdd($accumulated, $taskStatus->getCompressPoint()),
                0
            );

        $stretchPoint = $this->getTaskStatuses()
            ->reduce(
                fn(float $accumulated, TaskStatus $taskStatus) =>
                Calculator::floatAdd($accumulated, $taskStatus->getStretchPoint()),
                0
            );

        return [$point, $compressPoint, $stretchPoint];
    }

    /**
     * @return float|int
     */
    public function getLeftPoint(): float|int
    {
        $point = Calculator::floatSub($this->point, $this->allocatedPoint);
        return $point > 0 ? $point : 0;
    }

    /**
     * @param  float  $point
     * @return $this
     */
    public function addAllocatedPoint(float $point): static
    {
        $this->allocatedPoint = Calculator::floatAdd($this->allocatedPoint, $point);

        return $this;
    }

    /**
     * @param  TaskStatus  $taskStatus
     * @return $this
     */
    public function addTaskStatus(TaskStatus $taskStatus): static
    {
        $this->taskStatuses[] = $taskStatus;

        return $this;
    }

    /**
     * @return string
     */
    public function getProjectSlug(): string
    {
        return $this->projectSlug;
    }

    /**
     * @return float
     */
    public function getPoint(): float
    {
        return $this->point;
    }

    /**
     * @return float
     */
    public function getStretchPoint(): float
    {
        return $this->stretchPoint;
    }

    /**
     * @return float|int
     */
    public function getAllocatedPoint(): float|int
    {
        return $this->allocatedPoint;
    }

    /**
     * @return Collection
     */
    public function getTaskStatuses(): Collection
    {
        return collect($this->taskStatuses);
    }

}
