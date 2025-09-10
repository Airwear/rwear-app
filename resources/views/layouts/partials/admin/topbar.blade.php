<nav class="navbar navbar-expand navbar-light bg-white topbar static-top border-bottom">

    <!-- Sidebar Toggle (Topbar) -->
    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
        <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Search -->
    {{--@include('layouts.partials.admin.topbar.search')--}}

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
        <!-- Nav Item - Search Dropdown (Visible Only XS) -->
        {{--@include('layouts.partials.admin.topbar.search')--}}
        <!-- Nav Item - Alerts -->
        {{--@include('layouts.partials.admin.topbar.alerts')--}}
        <!-- Nav Item - Messages -->
        {{--@include('layouts.partials.admin.topbar.messages')--}}

        {{--<div class="topbar-divider d-none d-sm-block"></div>--}}
        <!-- Nav Item - User Information -->
        @include('layouts.partials.admin.topbar.auth')
    </ul>

</nav>
