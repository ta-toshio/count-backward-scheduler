<?php


namespace App\Repositories;


use App\Domains\Models\Config as ConfigDomainModel;
use App\Models\Config as ConfigEloquent;

class ConfigRepository
{

    public function upsert(int $userId, ConfigDomainModel $config)
    {
        return ConfigEloquent::updateOrCreate(
            ['user_id' => $userId],
            [
                'user_id' => $userId,
                'start_date' => $config->getStartDate()->format('Y-m-d'),
                'sprint' => $config->getSprint(),
                'hour_of_day' => $config->getOneDayAbilityHour(),
                'point_of_day' => $config->getOneDayAbilityPoint(),
                'project_of_day' => $config->getOneDayAbilityProject(),
                'holidays' => $config->getHolidays(),
            ]
        );
    }

}
