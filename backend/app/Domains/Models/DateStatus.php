<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class DateStatus
{

    private CarbonImmutable $date;
    private float $limitPoint;
    private array $dateProjectStatuses;

    public function __construct(CarbonImmutable $date, float $limitPoint = 0, array $dateProjectStatuses = [])
    {
        $this->date = $date;
        $this->limitPoint = $limitPoint;
        $this->dateProjectStatuses = $dateProjectStatuses;
    }

    /**
     * @param  DateProjectStatus  $dateProjectStatus
     * @return $this
     */
    public function addDateProjectStatus(DateProjectStatus $dateProjectStatus): static
    {
        $this->dateProjectStatuses[$dateProjectStatus->getSlug()] = $dateProjectStatus;
        return $this;
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
    public function getLimitPoint(): float|int
    {
        return $this->limitPoint;
    }

    /**
     * @return Collection
     */
    public function getDateProjectStatuses(): Collection
    {
        return collect($this->dateProjectStatuses);
    }

}
