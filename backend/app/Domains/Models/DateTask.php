<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class DateTask
{
    /**
     * @var CarbonImmutable
     */
    private CarbonImmutable $date;
    private int|float $point;
    private float $allocatedPoint = 0;
    private bool $isAssigned = false;

    /**
     * @var Task[]
     */
    private array $tasks = [];

    /**
     * DateTask constructor.
     */
    public function __construct(
        CarbonImmutable|string $date,
        float|int $point
    )
    {
        $this->date = $date instanceof CarbonImmutable ? $date : CarbonImmutable::parse($date);
        $this->point = $point;
    }

    public function addAllocatedPoint(float $point): static
    {
        $this->allocatedPoint = Calculator::floatAdd($this->allocatedPoint, $point);

        if ($this->allocatedPoint >= $this->point) {
            $this->assigned();
        }

        return $this;
    }

    /**
     * @param  Task  $task
     * @return $this
     */
    public function addTask(Task $task): static
    {
        $this->tasks[] = $task;

        return $this;
    }

    public function assigned()
    {
        $this->isAssigned = true;
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
     * @return CarbonImmutable
     */
    public function getDate(): CarbonImmutable
    {
        return $this->date;
    }

    /**
     * @return float|int
     */
    public function getPoint(): float|int
    {
        return $this->point;
    }

    /**
     * @return float
     */
    public function getAllocatedPoint(): float
    {
        return $this->allocatedPoint;
    }

    public function getTasks(): Collection
    {
        return collect($this->tasks);
    }

    /**
     * @return bool
     */
    public function isAssigned(): bool
    {
        return $this->isAssigned;
    }

}
