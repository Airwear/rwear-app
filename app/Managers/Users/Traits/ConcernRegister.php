<?php

namespace App\Managers\Users\Traits;

use App\Models\User;

trait ConcernRegister
{
    use ConnectedTrait;

    /**
     * @param array $payload
     * @return User
     */
    public function createUser(array $payload): User
    {
        $payload['password'] = bcrypt($payload['password']);

        $user = User::create($payload);

        //$this->connected($user);

        return $user;
    }
}
