<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\CreateRequest;
use App\Managers\Users\UserManager;
use App\Models\Group;
use App\Models\User;

class CreateController extends Controller
{
    /**
     * @param User $user
     * @param UserManager $manager
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function create(User $user, UserManager $manager)
    {
        return view('users.create', [
            'user' => $user,
            'groups' => Group::query()->orderBy('designation')->pluck('designation', 'id')->prepend(null, ''),
        ]);
    }

    /**
     * @param CreateRequest $request
     * @param UserManager $manager
     * @return \Illuminate\Http\RedirectResponse|void
     */
    public function store(CreateRequest $request, UserManager $manager)
    {
        try {
            $manager->create($request);

            return redirect()
                ->route('users.list', [$manager->user])
                ->with('success', trans('auth.created'));
        } catch (\Throwable $e) {
            return back()->with('error', trans('navigation.exception_error'));
        }
    }
}
