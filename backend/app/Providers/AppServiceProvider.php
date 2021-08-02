<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
//        \Illuminate\Support\Facades\DB::listen(function ($query) {
//            \Illuminate\Support\Facades\Log::info("Query Time:{$query->time}s] $query->sql");
//        });
    }
}
