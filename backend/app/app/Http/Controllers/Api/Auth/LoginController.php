<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Api\LoginRequest;
use Illuminate\Http\JsonResponse;

class LoginController extends BaseController
{
    /**
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {

            $user = $this->userAccessInterface->attemptToLogin(credentials: $request->only('email', 'password'));
            $data = [];

            if ($user) {
                $data = $this->userDataTransfer->transform($user);
            }

            return response()->json($this->success(action: 'login', data: $data));

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
