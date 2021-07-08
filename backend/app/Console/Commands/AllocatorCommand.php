<?php

namespace App\Console\Commands;

use App\Domains\Models\Allocators\AllocationManager;
use App\Domains\Models\Config;
use App\Domains\Models\Context;
use App\Domains\Models\Project;
use App\Domains\Models\ProjectManager;
use App\Domains\Models\ProjectStatusManager;
use App\Domains\Models\Task;
use App\Domains\Models\TaskStatusManager;
use App\Miscs\CsvReader;
use Illuminate\Console\Command;

class AllocatorCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'task:allocate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * @var CsvReader
     */
    private CsvReader $csvReader;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(CsvReader $csvReader)
    {
        parent::__construct();

        $this->csvReader = $csvReader;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $config = new Config(
            today('Asia/Tokyo')->format('Y-m-d'),
            8 * 1000,
            2,
            [0, 6],
            1
        );
        $projects = $this->readProjects();
        $tasks = $this->readTasks($projects);

        collect($projects)
            ->map(fn(Project $project) => $project->setTasks(
                collect($tasks)
                    ->filter(fn(Task $task) => $task->getProject()->getSlug() === $project->getSlug())
                    ->toArray()
            ));

        $projectManager = ProjectManager::createFromProjects($projects);
        $projectStatusManager = ProjectStatusManager::createFromProjects($projects);
        $context = new Context($projectStatusManager, $projectManager, $config);
        $context->createSimpleDateStatuses();

        $allocator = new AllocationManager($context);
        $allocator->handle();
    }

    private function readProjects(): array
    {
        $projects = [];

        try {
            $file = resource_path('app/projects.csv');
            $this->csvReader->parse($file);

            foreach ($this->csvReader->each() as $row) {
                $projects[] = new Project(
                    $row['slug'],
                    $row['title'],
                    $row['start_date'],
                    $row['end_date'],
                    $row['allocation_rate'],
                    $row['color']
                );
            }

        } catch (\Exception $e) {
            $this->error($e->getMessage());
            exit(1);
        }

        return $projects;
    }


    private function readTasks(array $projects): array
    {
        $projects = collect($projects);
        $tasks = [];

        try {
            $file = resource_path('app/tasks.csv');
            $this->csvReader->parse($file);

            foreach ($this->csvReader->each() as $row) {

                $category = $row['category'];
                $project = $projects
                    ->filter(fn($project) => $project->getSlug() === $category)
                    ->first();

                if (!is_numeric($row['man-hour'])) {
                    continue;
                }

                $task = new Task(
                    $project,
                    $row['title'],
                    $row['man-hour'] * Task::ONE_POINT_STANDS_FOR,
                    is_numeric($row['volume']) ? $row['volume'] : 0,
                    $row['days'] ? explode(',', $row['days']) : [],
                );
                if (!$task) {
                    continue;
                }
                $tasks[] = $task;
            }

        } catch (\Exception $e) {
            $this->error($e->getMessage());
            exit(1);
        }

        return $tasks;
    }
}
