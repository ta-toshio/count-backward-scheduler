<?php


namespace App\Domains\Models\Allocators;


use App\Domains\Models\DateProjectStatus;
use App\Domains\Models\DateStatus;
use App\Domains\Models\SprintProjectStatus;
use App\Domains\Models\SprintProjectStatusManager;
use App\Miscs\Calculator;
use Illuminate\Support\Collection;

trait AllocatorTrait
{

    private function createSprintProjectStatusManager(
        string $start,
        string $end,
        array $dateStatuses
    ): SprintProjectStatusManager {
        $sprintProjectStatuses = collect($dateStatuses)
            ->map(fn(DateStatus $dateStatus) => $dateStatus->getDateProjectStatuses())
            ->flatten()
            ->groupBy(fn(DateProjectStatus $dateProjectStatus) => $dateProjectStatus->getSlug())
            ->map(function (Collection $items, string $projectSlug) {
                $point = $items->reduce(
                    fn($accumulated, DateProjectStatus $dateProjectStatus) =>
                        Calculator::floatAdd($accumulated, $dateProjectStatus->getPoint()),
                    0
                );

                $stretchPoint = $items->reduce(
                    fn($accumulated, DateProjectStatus $dateProjectStatus) =>
                        Calculator::floatAdd($accumulated, $dateProjectStatus->getStretchPoint()),
                    0
                );

                return new SprintProjectStatus(
                    $projectSlug,
                    $point,
                    $stretchPoint
                );
            });
        return new SprintProjectStatusManager($start, $end, $sprintProjectStatuses->toArray());
    }

}
