<ul class="navbar-nav ml-auto">
    <li class="dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="userNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="far fa-user"></i>
            @impersonating
            <span class="position-absolute" style="top: 2px; left: 2px"
                  data-toggle="tooltip"
                  title="{!! trans('impersonate.tooltip_impersonating') !!}">
                        <span class="fa-stack" style="font-size: 0.8em;">
                            <i class="fas fa-circle fa-stack-2x text-danger"></i>
                            <i class="fa fa-user-secret fa-stack-1x fa-inverse"></i>
                        </span>
                    </span>
            @endImpersonating
            <span class="d-none d-sm-inline-flex">
                {{ auth()->user()->fullName }}
            </span>
        </a>
        <div class="dropdown-menu dropdown-menu-right user-navbar-dropdown" aria-labelledby="userNavbarDropdown">
            <div class="user-navbar-dropdown__header">
                <p>{{ auth()->user()->fullName }}<br>
                    <small>{!! trans('users.registered_at', [
                        'created_at' => auth()->user()->created_at->translatedFormat('l j F Y')
                    ]) !!}</small>
                </p>
            </div>
            <div class="user-navbar-dropdown__footer">
                <div class="pb-3">
                    @impersonating
                    <a href="{!! route('impersonate.leave') !!}"
                       class="btn btn-warning btn-block"
                       data-toggle="tooltip"
                       title="{!! trans('impersonate.tooltip_stop_impersonating') !!}">
                        <i class="fa fa-user-secret"></i>
                        {!! trans('impersonate.btn_stop') !!}
                    </a>
                    @endImpersonating
                </div>
                <div class="btn-group" role="group" aria-label="Logged in user actions">
                    <a href="{{ route('admin.users.update-me') }}"
                       class="btn btn-primary text-nowrap">
                        <i class="fal fa-user"></i>
                        {!! trans('navigation.profile') !!}
                    </a>
                    <a class="nav-link" data-bs-target="tooltip" title="{!! trans('auth.logout') !!}" href="#!" onclick="document.getElementById('form-logout').submit()">
                        <i class="fas fa-power-off text-danger"></i>
                        <form id="form-logout" method="POST" action="{{ route('logout') }}" class="d-inline-block">
                            @csrf
                        </form>
                    </a>
                </div>
            </div>
        </div>
    </li>
</ul>
