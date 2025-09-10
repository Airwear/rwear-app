<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UpdateMeRequest;
use App\Http\Requests\Users\UpdatePasswordRequest;
use App\Managers\Users\UserManager;

class UpdateMeController extends Controller
{
    /**
     * @param UserManager $manager
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(UserManager $manager)
    {
        return view('users.me', [
            'user' => auth()->user(),
        ]);
    }

    /**
     * @param UpdateMeRequest $request
     * @param UserManager $userManager
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateMeRequest $request, UserManager $userManager)
    {
        try {
            $message = trans('auth.updated');
            $key = 'success';

            $userManager->updateMe($request);
        } catch (\Throwable $exception) {
            $message = trans('navigation.exception_message');
            $key = 'error';
        }

        return back()->with($key, $message);
    }

    /**
     * @param UpdatePasswordRequest $request
     * @param UserManager $userManager
     * @return \Illuminate\Http\RedirectResponse
     */
    public function changePassword(UpdatePasswordRequest $request, UserManager $userManager): \Illuminate\Http\RedirectResponse
    {
        try {
            $message = trans('auth.updated');
            $key = 'success';

            //Match The Old Password
            if (!\Hash::check($request->post('old_password'), $request->user()->password)) {
                $message = trans('Old Password Doesn\'t match!');
                $key = 'error';
            } else {
                $userManager->changePassword(auth()->user(), $request);
            }
        } catch (\Throwable $exception) {
            $message = trans('navigation.exception_message');
            $key = 'error';
        }

        return back()->with($key, $message)->withInput([
            'old_password',
            'new_password',
        ]);
    }
}
