<?php

namespace App\View\Composers;
use App\Models\Group;
use App\Models\User;
use Illuminate\View\View;

class SharedViewData
{
    public function compose(View $view): void
    {
        $view
            ->with('context', self::context())
            ->with('version', 1.0)
            ->with('publicAdminThemePath', '/vendor/admin')
        ;
    }

    public static function context(): \Illuminate\Contracts\Auth\Authenticatable|Group|User
    {
        if (! auth()->check()) {
            return new User();
        }

        return auth()->user();
    }
}
