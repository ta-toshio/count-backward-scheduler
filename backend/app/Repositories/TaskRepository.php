<?php


namespace App\Repositories;


use App\Domains\Models\Task as TaskDomainModel;
use App\Models\Task;

class TaskRepository
{

    public function upsert(int $userId, int $projectId, TaskDomainModel $task)
    {
        return Task::updateOrCreate(
            ['user_id' => $userId],
            [
                'user_id' => $userId,
                'project_id' => $projectId,
                'title' => $task->getTitle(),
                'point' => $task->getPoint(),
                'volume' => $task->getVolume(),
                'days' => $task->getDays(),
            ]
        );
    }

}
