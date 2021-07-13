<?php


namespace App\Repositories;


use App\Domains\Models\Task as TaskDomainModel;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;

class TaskRepository
{

    public function upsert(int $userId, int $projectId, TaskDomainModel $task): Model|Task
    {
        return Task::updateOrCreate(
            [
                'user_id' => $userId,
                'project_id' => $projectId,
                'title' => $task->getTitle(),
            ],
            [
                'user_id' => $userId,
                'project_id' => $projectId,
                'title' => $task->getTitle(),
                'point' => $task->getPoint(),
                'org_point' => $task->getOrgPoint(),
                'volume' => $task->getVolume(),
                'days' => implode(',', $task->getDays()),
            ]
        );
    }

}
