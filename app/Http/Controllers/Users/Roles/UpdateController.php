<?php

namespace App\Http\Controllers\Users\Roles;

use App\Http\Requests\Users\Roles\UpdateRequest;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateController
{
    /**
     * @param Role $role
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Role $role)
    {
        return view('users.roles.edit', [
            'role' => $role,
            'permissions' => Permission::query()->orderBy('name')->get(),
        ]);
    }

    /**
     * @param UpdateRequest $request
     * @param Role $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateRequest $request, Role $role)
    {
        try {
            \DB::transaction(function () use ($request, $role) {
                $role->update([
                    'name' => $request->post('name'),
                    'guard_name' => $request->post('guard_name'),
                    'display_name' => $request->post('display_name'),
                ]);

                $role->syncPermissions(
                    array_keys($request->post('permission') ?? [])
                );
            });

            return back()->with('success', trans('auth.updated'));
        } catch (\Throwable $exception) {
            return back()->with('error', trans('navigation.exception_message'));
        }
    }
}
