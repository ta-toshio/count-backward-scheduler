<?php

namespace App\Domains\UseCases;

use App\Repositories\ScheduledTaskRepository;
use Illuminate\Support\Facades\Log;

class GetCalendarData
{

    private ScheduledTaskRepository $scheduledTaskRepository;

    public function __construct(ScheduledTaskRepository $scheduledTaskRepository)
    {

        $this->scheduledTaskRepository = $scheduledTaskRepository;
    }

    public function handle(int $userId, string $start, string $end)
    {
        $data = $this->scheduledTaskRepository->findAllBetween($userId, $start, $end);
        $hasPrev = $this->scheduledTaskRepository->existsLt($userId, $start);
        $hasNext = $this->scheduledTaskRepository->existsGt($userId, $end);
        return [
            'data' => $data,
            'prev' => $hasPrev,
            'next' => $hasNext,
        ];
    }


}
