<li class="nav-item d-none {{ \Route::is('articles.*')  ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('articles.list') }}">
        <i class="fas fa-fw fa-gift"></i>
        <span>Articles</span>
    </a>
</li>

<li class="nav-item {{ \Route::is('trainings.*')  ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('trainings.list') }}">
        <i class="fas fa-fw fa-video"></i>
        <span>Vidéos</span>
    </a>
</li>

<li class="nav-item {{ \Route::is('categories.*')  ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('categories.list') }}">
        <i class="fas fa-fw fa-list-ol"></i>
        <span>Catégories</span>
    </a>
</li>

<li class="nav-item {{ \Route::is('coaches.*')  ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('coaches.list') }}">
        <i class="fas fa-fw fa-running"></i>
        <span>Coaches</span>
    </a>
</li>

<li class="nav-item {{ \Route::is('materials.*')  ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('materials.list') }}">
        <i class="fas fa-fw fa-box"></i>
        <span>Matériels</span>
    </a>
</li>


<!-- Entreprise -->
@if(auth()->user()->is_super_admin)
    <li class="nav-item {{ \Route::is('users.*')  ? 'active' : null }}">
        <a class="nav-link py-2" href="{{ route('users.list') }}">
            <i class="fas fa-fw fa-users"></i>
            <span>Utilisateurs</span>
        </a>
    </li>
@endif

<li class="nav-item {{ \Route::is('groups.*') ? 'active' : null }}">
    <a class="nav-link py-2" href="{{ route('groups.list') }}">
        <i class="fas fa-fw fa-house-user"></i>
        <span>Entreprise</span>
    </a>
</li>

<!-- Divider -->
<hr class="sidebar-divider d-none d-md-block">
