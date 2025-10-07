<?php

namespace App\Managers\Users\Traits;

use Illuminate\Foundation\Auth\User as Authenticatable;

trait ConnectedTrait
{
    /**
     * @param Authenticatable $user
     * @return void
     */
    protected function connected(Authenticatable $user): void
    {
        $user->update(['last_connection' => now()]);
    }
}
