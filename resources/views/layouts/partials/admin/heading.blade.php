<div class="d-sm-flex align-items-center justify-content-between my-4">
    <div class="w-100">
        <h1 class="h3 mb-0 text-gray-800">{{ $title ?? null }}</h1>
        <h6>{{ $subTitle ?? null }}</h6>
    </div>
    <div class="w-100 text-right">
        @yield('heading-right')
    </div>
</div>
