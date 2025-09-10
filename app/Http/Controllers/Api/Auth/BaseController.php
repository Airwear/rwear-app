<?php

namespace App\Http\Controllers\Api\Auth;

use App\Contracts\Auth\UserAccessInterface;
use App\Exceptions\AuthException;
use App\Http\Controllers\Controller;
use App\DataTransformers\UserTransformer;
use Illuminate\Http\Client\RequestException;

class BaseController extends Controller
{

    /**
     * @param UserAccessInterface $userAccessInterface
     * @param UserTransformer $userDataTransfer
     */
    public function __construct(
        protected readonly UserAccessInterface $userAccessInterface,
        protected readonly UserTransformer $userDataTransfer
    )
    {
    }

    protected function statusCode(\Throwable $e): int
    {
        if ($e instanceof RequestException) {
            return  414;
        }

        return 500;
    }
}
