<?php

namespace App\Contracts\Auth;

use App\Models\User;

interface UserAccessInterface
{
    /**
     * @param array $credentials
     * @return string|null
     */
    public function accessToken(array $credentials): ?string;

    /**
     * @param array $payload
     * @return User
     */
    public function createUser(array $payload): User;

    /**
     * @param User $user
     * @param array $payload
     * @return User
     */
    public function updateUserInfo(User $user, array $payload): User;

    /**
     * @return User
     */
    public function user(): User;

    /**
     * @param User $user
     * @return void
     */
    public function delete(User $user): void;

}
