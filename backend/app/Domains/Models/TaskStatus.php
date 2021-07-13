<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;

class TaskStatus
{

    private Task $task;
    private string $projectSlug;
    private string $title;
    private string $hash;
    private float $point;
    private float $compressPoint;
    private float $allocatedCompressPoint = 0;
    private float $compressCoef = 1;
    private int $volume;
    private array $days;
    private bool $isAssigned = false;
    private float $stretchPoint;

    public function __construct(
        Task $task,
        string $projectSlug,
        string $title,
        float $point,
        float $compressPoint,
        float $stretchPoint,
        float $compressCoef,
        int $volume,
        array $days = []
    ) {
        $this->task = $task;
        $this->projectSlug = $projectSlug;
        $this->title = $title;
        $this->hash = Hash('md5', $title);
        $this->point = $point;
        $this->compressPoint = $compressPoint;
        $this->stretchPoint = $stretchPoint;
        $this->compressCoef = $compressCoef;
        $this->volume = $volume;
        $this->days = $days;
    }

    /**
     * @param  float  $point
     * @return $this
     */
    public function addAllocatedCompressPoint(float $point): static
    {
        $this->allocatedCompressPoint = Calculator::floatAdd($this->allocatedCompressPoint, $point, 4);

        if ($this->allocatedCompressPoint >= $this->compressPoint) {
//            $this->allocatedCompressPoint = $this->compressPoint;
            $this->assigned();
        }

        return $this;
    }

    public function getLeftCompressPoint(): float|int
    {
        $point = Calculator::floatSub($this->compressPoint, $this->allocatedCompressPoint, 4);
        return $point > 0 ? $point : 0;
    }

    public function assigned()
    {
        $this->isAssigned = true;
    }

    public function computeStretchPoint(float|int $point): float
    {
        return Calculator::floatMul($point, $this->getCompressCoef());
    }

    /**
     * @return Task
     */
    public function getTask(): Task
    {
        return $this->task;
    }

    /**
     * @return Task
     */
    public function cloneTask(): Task
    {
        $clone = clone $this->task;
        $clone->setOrgTask($this->task);
        return $clone;
    }

    /**
     * @return string
     */
    public function getProjectSlug(): string
    {
        return $this->projectSlug;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return false|string
     */
    public function getHash(): bool|string
    {
        return $this->hash;
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
    public function getCompressPoint(): float
    {
        return $this->compressPoint;
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
    public function getAllocatedCompressPoint(): float|int
    {
        return $this->allocatedCompressPoint;
    }

    /**
     * @return float
     */
    public function getCompressCoef(): float
    {
        return $this->compressCoef;
    }

    /**
     * @return int
     */
    public function getVolume(): int
    {
        return $this->volume;
    }

    /**
     * @return array
     */
    public function getDays(): array
    {
        return $this->days;
    }

    /**
     * @return bool
     */
    public function isAssigned(): bool
    {
        return $this->isAssigned;
    }

    /**
     * @param  bool  $isAssigned
     * @return TaskStatus
     */
    public function setIsAssigned(bool $isAssigned): TaskStatus
    {
        $this->isAssigned = $isAssigned;
        return $this;
    }

}
