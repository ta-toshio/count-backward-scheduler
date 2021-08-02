<?php


namespace App\Repositories;


use App\Domains\Models\DateTask;
use App\Models\ScheduledTask;
use App\Models\Task;

class ScheduledTaskRepository
{

    public function upsert(int $userId, int $projectId, DateTask $task)
    {

    }

    public function findAllBetween(int $userId, string $start, string $end)
    {
        return ScheduledTask::query()
            ->with(['task'])
            ->where('user_id', $userId)
            ->whereBetween('the_date', [$start, $end])
            ->get();
    }

    public function existsLt(string $userId, $theDate): bool
    {
        return ScheduledTask::query()
            ->where('user_id', $userId)
            ->where('the_date', '<', $theDate)
            ->exists();
    }

    public function existsGt(string $userId, $theDate): bool
    {
        return ScheduledTask::query()
            ->where('user_id', $userId)
            ->where('the_date', '>', $theDate)
            ->exists();
    }

}
