<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Api\UpdateRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UpdateController extends BaseController
{
    /**
     * @param UpdateRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, User $user): JsonResponse
    {
        try {

            $user = $this->userDataTransfer->transform(
                user: $this->userAccessInterface->updateUserInfo(user: $user, payload: $request->validated())
            );

            $this->message = trans('auth.updated');

            return response()->json(
                $this->success(action: 'update', data: $user)
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
