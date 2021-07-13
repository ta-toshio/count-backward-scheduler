<?php


namespace App\Domains\UseCases;


use App\Domains\Models\Config;
use App\Domains\Models\Project;
use App\Domains\Models\Task;
use App\Repositories\ConfigRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;

class StoreMainData
{

    private ConfigRepository $configRepository;
    private ProjectRepository $projectRepository;
    private TaskRepository $taskRepository;

    public function __construct(
        ConfigRepository $configRepository,
        ProjectRepository $projectRepository,
        TaskRepository $taskRepository
    ) {

        $this->configRepository = $configRepository;
        $this->projectRepository = $projectRepository;
        $this->taskRepository = $taskRepository;
    }

    /**
     * @param  int  $userId
     * @param  Config  $config
     * @param  Project[]  $projects
     */
    public function handle(int $userId, Config $config, array $projects)
    {
        $this->storeConfig($userId, $config);

        foreach ($projects as $project) {
            $projectEloquent = $this->storeProject($userId, $project);
            $project->setProjectId($projectEloquent->id);
            $project->getTasks()
                ->each(function (Task $task) use ($userId, $projectEloquent) {
                    $taskEloquentModel = $this->storeTask($userId, $projectEloquent->id, $task);
                    $task->setTaskId($taskEloquentModel->id);
                });
        }
    }

    public function storeConfig(int $userId, Config $config)
    {
        return $this->configRepository->upsert($userId, $config);
    }

    public function storeProject(int $userId, Project $project)
    {
        return $this->projectRepository->upsert($userId, $project);
    }

    public function storeTask(int $userId, int $projectId, Task $task)
    {
        return $this->taskRepository->upsert($userId, $projectId, $task);
    }

}
