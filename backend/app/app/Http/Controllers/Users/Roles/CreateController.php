<?php

namespace App\Http\Controllers\Users\Roles;

use App\Http\Requests\Users\Roles\CreateRequest;
use Spatie\Permission\Models\Role;

class CreateController
{
    /**
     * @param Role $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create(Role $role)
    {
        return back();

        /*return view('users.roles.create', [
            'role' => $role,
        ]);*/
    }

    /**
     * @param CreateRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CreateRequest $request)
    {
        try {
            $role = Role::create([
                'name' => $request->post('name'),
                'guard_name' => $request->post('guard_name'),
                'display_name' => $request->post('display_name'),
            ]);

            return redirect()->route('admin.users.roles.edit', $role)->with('success', trans('roles.message_created'));
        } catch (\Throwable $exception) {
            return back()->with('error', trans('navigation.exception_message'));
        }
    }
}
