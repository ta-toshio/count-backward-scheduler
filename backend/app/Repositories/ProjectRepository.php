<?php


namespace App\Repositories;


use App\Domains\Models\Project as ProjectDomainModel;
use App\Models\Project;

class ProjectRepository
{

    public function upsert(int $userId, ProjectDomainModel $project)
    {
        return Project::updateOrCreate(
            ['slug' => $project->getSlug()],
            [
                'user_id' => $userId,
                'slug' => $project->getSlug(),
                'title' => $project->getTitle(),
                'start_date' => $project->getStartDate(),
                'end_date' => $project->getEndDate(),
                'ratio' => $project->getAllocationRatio(),
                'color' => $project->getColor(),
            ]
        );
    }

}
