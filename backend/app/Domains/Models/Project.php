<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class Project
{
    /**
     * @var string
     */
    private string $slug;

    /**
     * @var string
     */
    private string $title;

    /**
     * @var CarbonImmutable|null
     */
    private ?CarbonImmutable $startDate;

    /**
     * @var CarbonImmutable|null
     */
    private ?CarbonImmutable $endDate;

    /**
     * @var float
     */
    private float $allocationRatio;

    /**
     * @var float
     */
    private float $coef = 0;

    /**
     * @var string
     */
    private string $color;

    /**
     * @var Task[]
     */
    private array $tasks;

    /**
     * @var int|null
     */
    private ?int $projectId = null;

    /**
     * Project constructor.
     * @param  string  $slug
     * @param  string  $title
     * @param  string  $startDate
     * @param  string  $endDate
     * @param  float  $allocationRatio
     * @param  string  $color
     * @param  array  $tasks
     */
    public function __construct(
        string $slug,
        string $title,
        string $startDate,
        string $endDate,
        float $allocationRatio,
        string $color = '',
        array $tasks = []
    )
    {
        $this->slug = $slug;
        $this->title = $title;
        $this->startDate = $startDate ? CarbonImmutable::parse($startDate): null;;
        $this->endDate = $endDate? CarbonImmutable::parse($endDate): null;;
        $this->allocationRatio = $allocationRatio;
        $this->color = $color;
        $this->tasks = $tasks;
    }

    /**
     * @param  bool $static
     * @return float
     */
    public function getTotalPoInt(bool $static = false): float
    {
        if ($static) {
            return collect($this->tasks)
                ->reduce(
                    fn($totalPoint, Task $task) => Calculator::floatAdd($totalPoint, $task->getPoint()),
                    0
                );
        }
        return collect($this->tasks)
            ->filter(fn(Task $task) => !$task->isStatic())
            ->reduce(
                fn($totalPoint, Task $task) => Calculator::floatAdd($totalPoint, $task->getPoint()),
                0
            );
    }

    public function getStaticTasks(): Collection
    {
        return $this->getTasks()
            ->filter(fn(Task $task) => $task->isStatic());
    }

    /**
     * @return string
     */
    public function getSlug(): string
    {
        return $this->slug;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getStartDate(): ?CarbonImmutable
    {
        return $this->startDate;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getEndDate(): ?CarbonImmutable
    {
        return $this->endDate;
    }

    /**
     * @return float
     */
    public function getAllocationRatio(): float
    {
        return $this->allocationRatio;
    }

    /**
     * @return float
     */
    public function getCoef(): float|int
    {
        return $this->coef;
    }

    /**
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }

    /**
     * @return Collection
     */
    public function getTasks(): Collection
    {
        return collect($this->tasks);
    }

    /**
     * @return int|null
     */
    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    /**
     * @param  float  $coef
     * @return $this
     */
    public function setCoef(float $coef): static
    {
        $this->coef = $coef;
        return $this;
    }

    /**
     * @param  array  $tasks
     * @return Project
     */
    public function setTasks(array $tasks): static
    {
        $this->tasks = $tasks;
        return $this;
    }

    /**
     * @param  int|null  $projectId
     */
    public function setProjectId(?int $projectId): void
    {
        $this->projectId = $projectId;
    }

}
