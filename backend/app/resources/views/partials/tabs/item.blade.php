<div class="d-inline-block p-1">
    @if(! \Route::is($routeIs ?? '#'))
        <a
            data-bs-target="tooltip"
            title="{{ $title ?? null }}"
            href="{{ $url ?? '#' }}"
            class="btn btn-dark shadow loader text-{!! \Route::is($routeIs ?? '#') ? 'warning' : '' !!} rounded small text-uppercase text-decoration-none"
        >
            <i class="fa {{ $fa ?? 'info' }} fa-fw"></i> {{ $label ?? null }}
        </a>
    @else
        <button
            data-bs-target="tooltip"
            title="{{ $title ?? null }}"
            href="{{ $url ?? '#' }}"
            disabled
            class="btn btn-dark shadow loader text-{!! \Route::is($routeIs ?? '#') ? 'warning' : '' !!} rounded small text-uppercase text-decoration-none"
        >
            <i class="fa {{ $fa ?? 'info' }} fa-fw"></i> {{ $label ?? null }}
        </button>
    @endif
</div>
