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

        try {
            $user->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Verification email failed: ' . $e->getMessage());
        }

        //$this->connected($user);

        return $user;
    }
}
