<?php


namespace App\Repositories;


use App\Models\User;
use Illuminate\Support\Facades\Date;

class UserRepository
{

    /**
     * @param  string  $email
     * @return User|null
     */
    public function findByEmail(string $email): User|null
    {
        return User::query()->where('email', $email)->first();
    }

    /**
     * @param  string  $email
     * @param  string  $name
     * @return User
     */
    public function createUserOfThirdParty(string $email, string $name): User
    {
        return User::query()->create([
            'email' => $email,
            'name' => $name,
            'email_verified_at' => Date::now(),
        ]);
    }
}
