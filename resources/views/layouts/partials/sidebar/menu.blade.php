<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="/" class="text-center d-block text-decoration-none top-bar-color" id="brand-link">
        {{--<img src="{!! asset('images/logo.png') !!}" alt="{!! config('app.name') !!}" class="brand-image position-relative">--}}
        <h3 class="pt-3">{!! config('app.name') !!}</h3>
    </a>

    <div class="sidebar" id="main-sidebar">
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item {!! \Route::is('admin.dashboard') ? 'active' : null !!}">
                    <a href="/" class="nav-link {!! \Route::is('admin.dashboard') ? 'text-white' : null !!}">
                        <i class="nav-icon fas fa-map"></i>
                        <p>
                            {!! trans('navigation.dashboard') !!}
                        </p>
                    </a>
                </li>
                @can('manage parameters')
                    @include('layouts.partials.sidebar.parameters')
                @endcan
                @can('manage users')
                    @include('layouts.partials.sidebar.users-access')
                @endcan
            </ul>
        </nav>

    </div>

</aside>
