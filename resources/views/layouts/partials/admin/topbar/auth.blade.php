<li class="nav-item dropdown no-arrow">

    <a
        class="nav-link dropdown-toggle"
        href="#"
        id="userDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
        <span class="mr-2 d-lg-inline text-gray-600 small text-uppercase">{{ $username = auth()->user()->username }}</span>
        <img
            alt="{{ $username }}"
            title="{{ $username }}"
            class="img-profile rounded-circle"
            src="/images/user.png"
        />
    </a>

    <!-- Dropdown - User Information -->
    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">

        <a class="dropdown-item" href="{{ route('users.update-me') }}">
            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
            Profile
        </a>

        <a class="dropdown-item d-none" href="#">
            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
            Settings
        </a>

        <a class="dropdown-item d-none" href="#">
            <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
            Activity Log
        </a>

        <div class="dropdown-divider d-none"></div>

        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Déconnexion
        </a>
    </div>
</li>
