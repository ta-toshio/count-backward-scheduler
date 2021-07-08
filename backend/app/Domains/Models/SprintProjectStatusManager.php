<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;

class SprintProjectStatusManager
{

    private CarbonImmutable $startDate;
    private CarbonImmutable $endDate;
    private array $sprintProjectStatuses;

    public function __construct($startDate, $endDate, array $sprintProjectStatuses)
    {
        $this->startDate = $startDate instanceof CarbonImmutable
            ? $startDate
            : CarbonImmutable::parse($startDate);
        $this->endDate = $endDate instanceof CarbonImmutable
            ? $endDate
            : CarbonImmutable::parse($endDate);
        $this->sprintProjectStatuses = $sprintProjectStatuses;
    }

    /**
     * @param  SprintProjectStatus  $sprintProjectStatus
     * @return $this
     */
    public function addSprintProjectStatus(SprintProjectStatus $sprintProjectStatus): static
    {
        $this->sprintProjectStatuses[$sprintProjectStatus->getProjectSlug()] = $sprintProjectStatus;

        return $this;
    }

    /**
     * @return CarbonImmutable
     */
    public function getStartDate(): CarbonImmutable
    {
        return $this->startDate;
    }

    /**
     * @return CarbonImmutable
     */
    public function getEndDate(): CarbonImmutable
    {
        return $this->endDate;
    }

    /**
     * @return array
     */
    public function getSprintProjectStatuses(): array
    {
        return $this->sprintProjectStatuses;
    }

    /**
     * @param  string  $projectSlug
     * @return SprintProjectStatus|null
     */
    public function getSprintProjectStatus(string $projectSlug): ?SprintProjectStatus
    {
        return $this->sprintProjectStatuses[$projectSlug] ?? null;
    }

}
