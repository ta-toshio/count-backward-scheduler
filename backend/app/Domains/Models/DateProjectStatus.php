<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;

class DateProjectStatus
{

    private string $slug;
    private float $ratio;
    private float $point;
    private float $stretchPoint;

    public function __construct(
        string $slug,
        float $ratio,
        float $point,
        float $stretchPoint = 0
    )
    {
        $this->slug = $slug;
        $this->ratio = $ratio;
        $this->point = $point;
        $this->stretchPoint = $stretchPoint;
    }

    public function updateStretchPoint(float $coef): static
    {
        $this->stretchPoint = Calculator::floatMul($this->point, $coef);

        return $this;
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
    public function getRatio(): float
    {
        return $this->ratio;
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

}
