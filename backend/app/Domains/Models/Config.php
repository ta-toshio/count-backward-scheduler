<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;

class Config
{

    /**
     * @var CarbonImmutable
     */
    private CarbonImmutable $startDate;

    /**
     * @var int
     */
    private int $oneDayAbilityPoint;

    /**
     * @var int
     */
    private int $oneDayAbilityProject;

    /**
     * @var array
     */
    private array $holidays;

    /**
     * @var int
     */
    private int $sprint;
    private int $oneDayAbilityHour;

    public function __construct(
        string $startDate,
        int $oneDayAbilityPoint,
        int $oneDayAbilityProject,
        array $holidays,
        int $sprint,
        int $oneDayAbilityHour
    ) {

        $this->startDate = CarbonImmutable::parse($startDate);
        $this->oneDayAbilityPoint = $oneDayAbilityPoint;
        $this->oneDayAbilityProject = $oneDayAbilityProject;
        $this->holidays = $holidays;
        $this->sprint = $sprint;
        $this->oneDayAbilityHour = $oneDayAbilityHour;
    }

    /**
     * @return CarbonImmutable
     */
    public function getStartDate(): CarbonImmutable
    {
        return $this->startDate;
    }

    /**
     * @return int
     */
    public function getOneDayAbilityPoint(): int
    {
        return $this->oneDayAbilityPoint;
    }

    /**
     * @return int
     */
    public function getOneDayAbilityProject(): int
    {
        return $this->oneDayAbilityProject;
    }

    /**
     * @return array
     */
    public function getHolidays(): array
    {
        return $this->holidays;
    }

    /**
     * @return int
     */
    public function getSprint(): int
    {
        return $this->sprint;
    }

    /**
     * @return int
     */
    public function getOneDayAbilityHour(): int
    {
        return $this->oneDayAbilityHour;
    }


}
