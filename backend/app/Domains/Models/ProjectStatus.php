<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;

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

    public function __construct(
        string $slug,
        float $totalPoint,
        float $ratio,
    ) {
        $this->slug = $slug;
        $this->totalPoint = $totalPoint;
        $this->ratio = $ratio;
    }

    /**
     * @param  float  $point
     * @return $this
     */
    public function addAllocatedTotalPoint(float $point): static
    {
        $this->allocatedTotalPoint = round(Calculator::floatAdd($this->allocatedTotalPoint, $point), 3);

        if ($this->allocatedTotalPoint >= $this->totalPoint) {
            $this->assigned();
        }

        return $this;
    }

    public function getLeftPoint(): float|int
    {
        $point = Calculator::floatSub($this->totalPoint, $this->allocationTotalPoint);
        return $point > 0 ? $point : 0;
    }

    public function computePointWithRatio(float $thePoint): float
    {
        return $this->_computePointWithRatio($thePoint);
    }

    public function computeStretchPointWithRatio(float $thePoint): float
    {
        $thisProjectPoint = $this->_computePointWithRatio($thePoint);
        return (float) Calculator::floatMul($thisProjectPoint, $this->getCompressCoef());
    }

    public function computeCompressPointWithRatio(float $thePoint): float
    {
        $thisProjectPoint = $this->_computePointWithRatio($thePoint);
        return (float) Calculator::floatDiv($thisProjectPoint, $this->getCompressCoef());
    }

    private function _computePointWithRatio(float $point): float
    {
         return (float) Calculator::floatMul(
            $point,
            Calculator::floatDiv($this->getCurrentRatio(), 100)
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
        $this->compressCoef = round(
            Calculator::floatAdd(Calculator::floatDiv($this->totalPoint, $this->allocatedTotalPoint), 0.01),
//            Calculator::floatDiv($this->totalPoint, $this->allocatedTotalPoint),
            3
        );
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

}
