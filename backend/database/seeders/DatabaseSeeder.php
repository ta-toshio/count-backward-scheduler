<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
//        \App\Models\User::factory(10)->create();

         $users = \App\Models\User::factory(1)->create();
         $user = $users->first();
         $user->name = 'test';
         $user->email = 'test@test.com';
         $user->save();
    }
}
