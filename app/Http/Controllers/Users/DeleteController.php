<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;

class DeleteController extends Controller
{
    /**
     * @param User $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete(User $user)
    {
        try {
            $user->delete();
            $message = trans('action.message_deleted');
            $key = 'success';
        } catch (\Exception $exception) {
            $message = trans('navigation.exception_error');
            $key = 'error';
        }

        return back()->with($key, $message);
    }
}
