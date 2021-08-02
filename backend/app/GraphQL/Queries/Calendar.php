<?php

namespace App\GraphQL\Queries;

use App\Domains\UseCases\GetCalendarData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class Calendar
{

    private GetCalendarData $getCalendarData;

    public function __construct(GetCalendarData $getCalendarData)
    {
        $this->getCalendarData = $getCalendarData;
    }

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $start = $args['start'] ?? Date::now()->firstOfMonth()->subMonth(1)->format('Y-m-d');
        $end = $args['end'] ?? Date::now()->firstOfMonth()->addMonth(1)->lastOfMonth()->format('Y-m-d');
        $userId = Auth::user()->id;

        $res = $this->getCalendarData->handle($userId, $start, $end);
        return [
            'data' => $res['data'],
            'info' => [
                'prev' => $res['prev'],
                'next' => $res['next'],
            ]
        ];
    }
}
