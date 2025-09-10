<?php

namespace App\Managers\Users\Traits;

use App\Models\User;

trait ConcernsUpdate
{
    /**
     * @param User $user
     * @param array $payload
     * @return User
     */
    public function updateUserInfo(User $user, array $payload): User
    {
        $user->update($payload);

        return $user;
    }
}
