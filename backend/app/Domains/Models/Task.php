<?php


namespace App\Domains\Models;


use App\Miscs\Calculator;
use Carbon\CarbonImmutable;

class Task
{

    const ONE_POINT_STANDS_FOR = 8 * 1000;

    /**
     * @var Project
     */
    private Project $project;

    /**
     * @var string
     */
    private string $hash;

    /**
     * @var string
     */
    private string $title;

    /**
     * @var float
     */
    private float $point;

    /**
     * @var int
     */
    private int $volume;

    /**
     * @var array
     */
    private array $days;

    /**
     * @var ?CarbonImmutable
     */
    private ?CarbonImmutable $date;

    /**
     * @var float
     */
    private float $allocatedPoint = 0;

    private ?int $taskId = null;

    private ?Task $orgTask = null;

    /**
     * Task constructor.
     * @param  Project  $project
     * @param  string  $title
     * @param  float  $point
     * @param  int  $volume
     * @param  array  $days
     */
    public function __construct(
        Project $project,
        string $title,
        float $point,
        int $volume,
        array $days = []
    ) {
        $this->project = $project;
        $this->hash = Hash('md5', $title);
        $this->title = $title;
        $this->point = $point;
        $this->volume = $volume;
        $this->days = $days;
    }

    /**
     * @return Project
     */
    public function getProject(): Project
    {
        return $this->project;
    }

    /**
     * @return false|string
     */
    public function getHash()
    {
        return $this->hash;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return float
     */
    public function getPoint(): float
    {
        return $this->point;
    }

    /**
     * @return int
     */
    public function getVolume(): int
    {
        return $this->volume;
    }

    /**
     * @return array
     */
    public function getDays(): array
    {
        return $this->days;
    }

    /**
     * @return CarbonImmutable|null
     */
    public function getDate(): ?CarbonImmutable
    {
        return $this->date;
    }

    /**
     * @return float
     */
    public function getAllocatedPoint(): float
    {
        return $this->allocatedPoint;
    }

    /**
     * @return int|null
     */
    public function getTaskId(): ?int
    {
        return $this->taskId;
    }

    /**
     * @return Task|null
     */
    public function getOrgTask(): ?Task
    {
        return $this->orgTask;
    }

    /**
     * @param  CarbonImmutable  $date
     * @return Task
     */
    public function setDate(CarbonImmutable $date): static
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @param  float|int  $allocatedPoint
     * @return $this
     */
    public function setAllocatedPoint(float|int $allocatedPoint): static
    {
        $this->allocatedPoint = $allocatedPoint;
        return $this;
    }

    /**
     * @param  float  $point
     * @return $this
     */
    public function addAllocationPoint(float $point): static
    {
        $this->allocatedPoint = round(Calculator::floatAdd($this->allocatedPoint, $point), 3);

        return $this;
    }

    /**
     * @return bool
     */
    public function isStatic(): bool
    {
        return !empty($this->days);
    }

    /**
     * @param  int|null  $taskId
     */
    public function setTaskId(?int $taskId): void
    {
        $this->taskId = $taskId;
    }

    /**
     * @param  Task|null  $orgTask
     */
    public function setOrgTask(?Task $orgTask): void
    {
        $this->orgTask = $orgTask;
    }

}
