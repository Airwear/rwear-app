<?php

namespace App\Managers\Users\Traits;

use App\Models\User;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Facades\JWTAuth;

trait ConcernsLogin
{
    use ConnectedTrait;

    /**
     * @param array $credentials
     * @return Authenticatable|false
     * @throws \Exception
     */
    public function attemptToLogin(array $credentials): Authenticatable | false
    {
        $guard = $this->authFactory->guard();

        if (! $guard->attempt(credentials: $credentials)) {
            throw new \Exception(message: 'User is not found', code: 404);
        }

        $user = $guard->user();

        $this->connected($user);

        return $user;
    }


    /**
     * @param array $credentials
     * @return string|null
     * @throws \Exception
     */
    public function accessToken(array $credentials): ?string
    {
        if ($user = $this->attemptToLogin(credentials: $credentials)) {
            return $this->getToken($user);
        }

        return null;
    }

    public function getToken(User $user): ?string
    {
        return JWTAuth::fromUser($user);
    }
}
