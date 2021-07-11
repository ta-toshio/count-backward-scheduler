<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class ProjectStatusManager
{

    /**
     * @var array
     */
    private array $projectStatuses;

    private function __construct()
    {
    }

    /**
     * @param  array  $projects
     * @return static
     */
    public static function createFromProjects(array $projects): static
    {
        $self = new static();

        $projectStatuses = [];

        /** @var Project $project */
        foreach ($projects as $project) {
            $projectStatuses[$project->getSlug()] = new ProjectStatus(
                $project->getSlug(),
                $project->getTotalPoInt(),
                $project->getAllocationRatio(),
                $project->getStartDate(),
                $project->getEndDate()
            );
        }

        $self->setProjectStatuses($projectStatuses);
        return $self;
    }

    /**
     * @param  string  $slug
     * @return ProjectStatus|null
     */
    public function getProjectStatus(string $slug): ?ProjectStatus
    {
        return $this->projectStatuses[$slug] ?? null;
    }

    public function areAllTaskAssigned(): bool
    {
        return $this->getProjectStatuses()
            ->every(fn(ProjectStatus $projectStatus) => $projectStatus->isAssigned());
    }

    /**
     * @param  CarbonImmutable  $date
     * @return Collection
     */
    public function findAllProjectHavingTaskToBeAssigned(CarbonImmutable $date): Collection
    {
        return $this->getProjectStatuses()
            ->filter(fn(ProjectStatus $projectStatus) => $projectStatus->isThisActiveDay($date));
    }

    /**
     * @return Collection
     */
    public function getProjectStatuses(): Collection
    {
        return collect($this->projectStatuses);
    }

    /**
     * @param  array  $projectStatuses
     * @return ProjectStatusManager
     */
    public function setProjectStatuses(array $projectStatuses): ProjectStatusManager
    {
        $this->projectStatuses = $projectStatuses;
        return $this;
    }

}
