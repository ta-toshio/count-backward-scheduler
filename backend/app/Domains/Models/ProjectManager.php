<?php


namespace App\Domains\Models;


use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class ProjectManager
{

    /**
     * @var Project[]
     */
    private array $projects;

    private function __construct() {}

    /**
     * @param  array  $projects
     * @return static
     */
    public static function createFromProjects(array $projects): static
    {
        $self = new static();

        $_projects = [];
        foreach ($projects as $project) {
            $_projects[$project->getSlug()] = $project;
        }

        $self->setProjects($_projects);
        return $self;
    }


    /**
     * @param  string  $slug
     * @return Project|null
     */
    public function getProject(string $slug): ?Project
    {
        return $this->projects[$slug] ?? null;
    }

    /**
     * @return Collection
     */
    public function getProjects(): Collection
    {
        return collect($this->projects);
    }

    /**
     * @return \Generator
     */
    public function getTasks(): \Generator
    {
        foreach ($this->projects as $project) {
            foreach ($project->getTasks() as $task) {
                yield $task;
            }
        }
    }

    /**
     * @return Task[]
     */
    public function getStaticTasks(): array
    {
        return $this->getProjects()
            ->filter(fn(Project $project) => $project->getStaticTasks()->count())
            ->reduce(
                function(array $tasks, Project $project) {
                    foreach($project->getStaticTasks() as $task) {
                        $tasks[] = $task;
                    }
                    return $tasks;
                }, []);
    }

    public function getStaticTasksWithin(CarbonImmutable $theDate)
    {
        return collect($this->getStaticTasks())
            ->filter(
                fn(Task $staticTask) => in_array($theDate->dayOfWeek, $staticTask->getDays())
            )
            ->filter(function (Task $staticTask) use ($theDate) {
                $startDate = $staticTask->getStartDate();
                $endDate = $staticTask->getEndDate();

                if ($startDate && $endDate) {
                    return $theDate->between($startDate, $endDate);
                }
                if ($startDate) {
                    return $theDate->gte($startDate);
                }
                if ($endDate) {
                    return $theDate->lte($endDate);
                }
                return true;
            });
    }

    /**
     * @param  Project[]  $projects
     * @return ProjectManager
     */
    public function setProjects(array $projects): ProjectManager
    {
        $this->projects = $projects;
        return $this;
    }

}
