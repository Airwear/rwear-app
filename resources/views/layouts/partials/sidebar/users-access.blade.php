<li class="nav-item {!! \Route::is('admin.users.*') ? 'menu-is-opening menu-open active' : null !!}">
    <a href="#" class="nav-link collapsed-link">
        <i class="nav-icon fas fa-users"></i>
        <p>
            {!! trans('navigation.users_access') !!}
            <i class="right fas fa-angle-left"></i>
        </p>
    </a>
    <ul class="nav nav-treeview">
        <li class="nav-item">
            <a
                href="{!! route('users.list') !!}"
                class="nav-link {!! \Route::is('users.list') || \Route::is('users.edit') ? 'text-white' : null !!}">
                {!! trans('auth.list_title') !!}
            </a>
        </li>
        @can('manage all')
            <li class="nav-item">
                <a
                    href="{!! route('users.roles.list') !!}"
                    class="nav-link {!! \Route::is('users.roles.*') ? 'text-white' : null !!}">
                    {!! trans('auth.role_title') !!}
                </a>
            </li>
        @endcan
    </ul>
</li>

