<ul class="navbar-nav ml-auto">
    {{--<li class="nav-item">
        <x-set-locale />
    </li>--}}

    <li class="nav-item position-relative user-menu">
        <a class="nav-link" role="button" id="profile">
            <i class="fas fa-cog mr-2"></i> {!! auth()->user()->full_name !!}
        </a>
    </li>

    @impersonating
        <li class="nav-item">
            <a href="{!! route('impersonate.leave') !!}"
               class="btn btn-warning btn-block"
               data-toggle="tooltip"
               title="{!! trans('impersonate.tooltip_stop_impersonating') !!}">
                <i class="fa fa-user-secret"></i>
                {!! trans('impersonate.btn_stop') !!}
            </a>
        </li>
    @endImpersonating

    <li class="nav-item d-none">
        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
            <i class="fas fa-expand-arrows-alt"></i>
        </a>
    </li>
</ul>

<div style="width: 350px; z-index: 1000; right: 0; top: 56px" class="position-absolute bg-white shadow card d-none" id="sub-profile">
    <div class="d-flex flex-column">
        <div class="top-bar-color p-2 py-4 text-center text-white">
            <h5>{!! auth()->user()->full_name !!}</h5>

            <div>{!! trans('auth.email') !!} : {!! auth()->user()->email !!}</div>

            <div>
                {!! trans('auth.profile') !!} :
                @if(auth()->user()->is_super_admin)
                    Super Admin
                @else
                    @foreach(auth()->user()->roles as $role)
                        {!! $role->name !!}
                    @endforeach
                @endif
            </div>
        </div>

        <div>
            <a class="nav-link text-dark d-block text-center" href="{!! route('users.update-me') !!}" role="button">
                <i class="fas fa-user-edit mr-2"></i>  {!! trans('auth.edit_profile') !!}
            </a>
        </div>

        <div class="bg-light p-2 text-right" style="z-index: 100">
            <form id="form-logout" method="POST" action="{{ route('logout') }}" class="d-inline-block">
                @csrf
                <button class="btn btn-primary text-white border-0" data-bs-target="tooltip" title="{!! trans('auth.logout') !!}">
                    <i class="fas fa-sign-out"></i> {!! trans('auth.logout') !!}
                </button>
            </form>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        function handleProfile() {
            const subProfile = $('#sub-profile');

            $('#profile').click(function () {
                $(this).parent().toggleClass('opened')
                subProfile.toggleClass('d-none')
            })
        }
    </script>
@endpush

@push('DOMLoaded')
    handleProfile()
@endpush
