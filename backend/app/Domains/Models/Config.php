<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;

class Config
{

    /**
     * @var CarbonImmutable|null
     */
    private ?CarbonImmutable $startDate;

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

    public function __construct(
        string $startDate,
        int $oneDayAbilityPoint,
        int $oneDayAbilityProject,
        array $holidays,
        int $sprint
    ) {

        $this->startDate = $startDate ? CarbonImmutable::parse($startDate): null;;
        $this->oneDayAbilityPoint = $oneDayAbilityPoint;
        $this->oneDayAbilityProject = $oneDayAbilityProject;
        $this->holidays = $holidays;
        $this->sprint = $sprint;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getStartDate(): ?CarbonImmutable
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

}
