<li
    class="nav-item {!! \Route::is('parameters..*') ? 'menu-is-opening menu-open active' : null !!}">
    <a href="#" class="nav-link collapsed-link {!! \Route::is('admin.parameters.*') ? 'text-white' : null !!}">
        <p>
            Parent
            <i class="right fas fa-angle-left"></i>
        </p>
    </a>
    <ul class="nav nav-treeview">
        <li class="nav-item">
            <a
                href="#"
                class="nav-link {!! \Route::is('parameters.*') ? 'text-white' : null !!}">
                Child
            </a>
        </li>
    </ul>
</li>
