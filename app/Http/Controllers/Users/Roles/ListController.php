<?php

namespace App\Http\Controllers\Users\Roles;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class ListController
{
    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index(Request $request)
    {
        return view('users.roles.list', [
            'list' => Role::query()->withCount('permissions')->orderBy('display_name')->get(),
        ]);
    }
}
