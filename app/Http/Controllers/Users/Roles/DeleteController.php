<?php

namespace App\Http\Controllers\Users\Roles;

use Spatie\Permission\Models\Role;

class DeleteController
{
    /**
     * @param Role $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete(Role $role)
    {
        try {

            //$role->delete();

            return back();
        } catch (\Throwable $exception) {
            return back();
        }
    }
}
