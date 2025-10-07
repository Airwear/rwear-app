<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UpdateRequest;
use App\Managers\Users\UserManager;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class UpdateController extends Controller
{
    /**
     * @param User $user
     * @param UserManager $manager
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(User $user, UserManager $manager)
    {
        return view('users.edit', [
            'user' => $user,
            'permissions' => Permission::all(),
            'groups' => Group::query()->orderBy('designation')->pluck('designation', 'id')->prepend(null, ''),
        ]);
    }

    /**
     * @param UpdateRequest $request
     * @param UserManager $userManager
     * @param User $user
     * @return RedirectResponse
     */
    public function update(UpdateRequest $request, UserManager $userManager, User $user): RedirectResponse
    {
        try {

            $userManager->update($user, $request);

            return back()->with('success', trans('auth.updated'));
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * @param Request $request
     * @param UserManager $userManager
     * @param User $user
     * @return RedirectResponse
     */
    public function setLocale(Request $request, UserManager $userManager, User $user): RedirectResponse
    {
        try {
            $userManager->setLocale($user, $request);
            //$message = trans('auth.language_updated');
            $message = '';
            $key = 'success';
        } catch (\Exception $exception) {
            $message = trans('navigation.exception_message');
            $key = 'error';
        }
        return back()->with($key, $message);
    }
}
