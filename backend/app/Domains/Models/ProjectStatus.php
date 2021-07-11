<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;

class ProjectStatus
{
    private string $slug;
    private float $totalPoint;
    private float $ratio;
    private float $allocationTotalPoint = 0;
    private float $allocatedTotalPoint = 0;
    private float $currentRatio = 0;
    private float $compressCoef = 1;
    private bool $isAssigned = false;
    private bool $isAssignedButNotFinished = false;
    private ?CarbonImmutable $start = null;
    private ?CarbonImmutable $end = null;

    public function __construct(
        string $slug,
        float $totalPoint,
        float $ratio,
        $start = null,
        $end = null
    ) {
        $this->slug = $slug;
        $this->totalPoint = $totalPoint;
        $this->ratio = $ratio;

        if ($start && $start instanceof CarbonImmutable) {
            $this->start = $start;
        } else if ($start) {
            $this->start = CarbonImmutable::parse($start);
        }
        if ($end && $end instanceof CarbonImmutable) {
            $this->end = $end;
        } else if ($end) {
            $this->end = CarbonImmutable::parse($end);
        }
    }

    /**
     * @param  float  $point
     * @return $this
     */
    public function addAllocatedTotalPoint(float $point): static
    {
        $this->allocatedTotalPoint = Calculator::floatAdd($this->allocatedTotalPoint, $point);

        if ($this->allocatedTotalPoint >= $this->totalPoint) {
            $this->assigned();
        }

        return $this;
    }

    public function getLeftPoint(): float|int
    {
        $point = Calculator::floatSub($this->totalPoint, $this->allocatedTotalPoint);
        return $point > 0 ? $point : 0;
    }

    public function computePointWithRatio(float $thePoint): float
    {
        return Calculator::floatMul(
            $thePoint,
            Calculator::floatDiv($this->getCurrentRatio(), 100),
            3
        );
    }

    /**
     * @param  float|null  $ratio
     * @return float|int|$this
     */
    public function currentRatio(float $ratio = null): float|int|static
    {
        if (is_null($ratio)) {
            return $this->currentRatio;
        }

        $this->currentRatio = Calculator::floatAdd($this->ratio, $ratio);

        return $this;
    }

    public function assigned()
    {
        $this->setCurrentRatio(0)
            ->setIsAssigned(True)
            ->setAllocationTotalPoint($this->allocatedTotalPoint);

        if ($this->allocatedTotalPoint < $this->totalPoint) {
            $this->isAssignedButNotFinished = true;
            $this->computeCompressCoef();
        }
    }

    public function computeCompressCoef()
    {
        $this->compressCoef = Calculator::floatDiv($this->totalPoint, $this->allocatedTotalPoint, 4);
    }

    /**
     * @return string
     */
    public function getSlug(): string
    {
        return $this->slug;
    }

    /**
     * @return float
     */
    public function getTotalPoint(): float
    {
        return $this->totalPoint;
    }

    /**
     * @return float
     */
    public function getRatio(): float
    {
        return $this->ratio;
    }

    /**
     * @return float|int
     */
    public function getAllocationTotalPoint(): float|int
    {
        return $this->allocationTotalPoint;
    }

    /**
     * @return float|int
     */
    public function getAllocatedTotalPoint(): float|int
    {
        return $this->allocatedTotalPoint;
    }

    /**
     * @return float|int
     */
    public function getCurrentRatio(): float|int
    {
        return $this->currentRatio;
    }

    /**
     * @return float|int
     */
    public function getCompressCoef(): float|int
    {
        return $this->compressCoef;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getStart(): ?CarbonImmutable
    {
        return $this->start;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getEnd(): ?CarbonImmutable
    {
        return $this->end;
    }

    /**
     * @return bool
     */
    public function isAssigned(): bool
    {
        return $this->isAssigned;
    }

    /**
     * @return bool
     */
    public function isAssignedButNotFinished(): bool
    {
        return $this->isAssignedButNotFinished;
    }

    /**
     * @param  float|int  $allocationTotalPoint
     * @return ProjectStatus
     */
    public function setAllocationTotalPoint(float|int $allocationTotalPoint): ProjectStatus
    {
        $this->allocationTotalPoint = $allocationTotalPoint;
        return $this;
    }

    /**
     * @param  float|int  $allocatedTotalPoint
     * @return ProjectStatus
     */
    public function setAllocatedTotalPoint(float|int $allocatedTotalPoint): static
    {
        $this->allocatedTotalPoint = $allocatedTotalPoint;
        return $this;
    }

    /**
     * @param  float|int  $currentRatio
     * @return ProjectStatus
     */
    public function setCurrentRatio(float|int $currentRatio): static
    {
        $this->currentRatio = $currentRatio;
        return $this;
    }

    /**
     * @param  bool  $isAssigned
     * @return ProjectStatus
     */
    public function setIsAssigned(bool $isAssigned): ProjectStatus
    {
        $this->isAssigned = $isAssigned;
        return $this;
    }

    /**
     * @param  float|int  $compressCoef
     * @return ProjectStatus
     */
    public function setCompressCoef(float|int $compressCoef): ProjectStatus
    {
        $this->compressCoef = $compressCoef;
        return $this;
    }

    public function isThisActiveDay(CarbonImmutable $theDate): bool
    {
        if ($this->isAssigned()) {
            return false;
        }
        if ($this->getStart() && $this->getEnd()) {
            return $theDate->between($this->getStart(), $this->getEnd());
        }
        if ($this->getStart()) {
            return $this->getStart()->lte($theDate);
        }
        if ($this->getEnd()) {
            return $this->getEnd()->gte($theDate);
        }
        return true;
    }

}
