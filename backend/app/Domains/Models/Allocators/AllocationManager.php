<?php


namespace App\Domains\Models\Allocators;


use App\Domains\Models\Context;
use App\Domains\Models\TaskStatusManager;

class AllocationManager
{

    private Context $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function handle()
    {
        $taskStatusManager = TaskStatusManager::createFromTasks(
            iterator_to_array($this->context->getProjectManager()->getTasks()),
            $this->context->getProjectStatusManager()
        );

        $allocate = $this->getAllocator();
        $allocator = new $allocate($this->context, $taskStatusManager);
        return $allocator->handle();
    }

    /**
     * @return string
     */
    public function getAllocator(): string
    {
        return SeriesAllocator::class;
    }
}
