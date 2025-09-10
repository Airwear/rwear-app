<?php

namespace App\Managers\Users;

use App\Contracts\Auth\UserAccessInterface;
use App\Models\User;
use App\Managers\Users\Traits\ConcernRegister;
use App\Managers\Users\Traits\ConcernsDelete;
use App\Managers\Users\Traits\ConcernsLogin;
use App\Managers\Users\Traits\ConcernsUpdate;
use Illuminate\Contracts\Auth\Factory;

class UserAccessManager implements UserAccessInterface
{
    use ConcernsLogin;
    use ConcernRegister;
    use ConcernsUpdate;
    use ConcernsDelete;

    /**
     * @var Factory|\Illuminate\Contracts\Foundation\Application|\Illuminate\Foundation\Application|mixed
     */
    private readonly Factory $authFactory;

    /**
     * @var string
     */
    private string $messageKey = '';

    /**
     * @var string
     */
    private string $messageCode = '';

    /**
     * @var bool
     */
    private bool $hasError = false;

    public function __construct()
    {
        $this->authFactory = app(Factory::class);
    }

    /**
     * @return User
     */
    public function user(): User
    {
        return $this->authFactory->guard()->user();
    }

    /**
     * @return string
     */
    public function messageCode(): string
    {
        return $this->messageCode;
    }

    /**
     * @return string
     */
    public function messageKey(): string
    {
        return $this->messageKey;
    }

    /**
     * @return bool
     */
    public function hasError(): bool
    {
        return $this->hasError;
    }
}
