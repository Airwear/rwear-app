<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListController extends BaseController
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {

            $users = User::all();

            return response()->json(
                $this->success(action: 'list', data: $this->userDataTransfer->toCollection($users))
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }

    /**
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        try {

            return response()->json(
                $this->success(
                    action: 'show',
                    data: $this->userDataTransfer->transform(user: $user)
                )
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
