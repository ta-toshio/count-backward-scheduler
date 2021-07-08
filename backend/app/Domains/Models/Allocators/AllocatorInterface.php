<?php


namespace App\Domains\Models\Allocators;


use App\Domains\Models\DateTask;
use App\Domains\Models\SprintProjectStatusManager;

interface AllocatorInterface
{
    public function support(string $identifier): bool;

    public function handle();

    public function assign(DateTask $dateTask, SprintProjectStatusManager $sprintProjectStatusManager);
}
