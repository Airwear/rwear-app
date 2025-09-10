<li class="nav-item {!! \Route::is('admin.parameters.*') ? 'menu-is-opening menu-open active' : null !!}">
    <a href="#" class="nav-link collapsed-link {!! \Route::is('admin.parameters.*') ? 'text-white' : null !!}">
        <i class="nav-icon fas fa-cog"></i>
        <p>
            {!! trans('navigation.parameters') !!}
            <i class="right fas fa-angle-left"></i>
        </p>
    </a>
    <ul class="nav nav-treeview">
        <li class="nav-item">
            @include('layouts.partials.sidebar.parameters.default')
        </li>
    </ul>
</li>
