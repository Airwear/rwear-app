<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Api\RegisterRequest;
use Illuminate\Http\JsonResponse;

class RegisterController extends BaseController
{
    /**
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {

            $data = $this->userAccessInterface->createUser(payload: $request->validated());

            if ($data->exists) {
                $this->message = "L'utilisateur a été crée";
            }

            return response()->json(
                $this->success(action: 'create', data: $this->userDataTransfer->transform(user: $data))
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
