<?php


namespace App\Domains\Models;


class DateProjectStatus
{

    private string $slug;
    private float $ratio;
    private float $point;
    private float $compressPoint;

    public function __construct(string $slug, float $ratio, float $point, float $compressPoint)
    {
        $this->slug = $slug;
        $this->ratio = $ratio;
        $this->point = $point;
        $this->compressPoint = $compressPoint;
    }

    public function updateCompressPoint(float $coef): static
    {
        $this->compressPoint = (float) bcmul($this->point, $coef, 3);

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
    public function getCompressPoint(): float
    {
        return $this->compressPoint;
    }

}
