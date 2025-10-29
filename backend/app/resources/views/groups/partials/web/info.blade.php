<div class="bg-white px-2 py-4">
    <header class="text-center">

        <h1 class="h6 font-weight-bold text-uppercase">{{ $group->designation }}</h1>

        <div class="my-1">
            <img
                src="{{ asset('/images/logo.png') }}"
                alt="{{ $group->designation }}"
                class="img-thumbnai"
                width="200"
            >
        </div>

        <div class="text-muted small">
            <i class="fas fa-map-marker fa-fw"></i> {{ $group->city }}
        </div>

        <div class="text-danger my-2">
            <span style="font-size: 17px">
                <i class="fas fa-star"></i> 5.881/5
            </span>
            <span class="text-muted small">sur 5000 avis</span>
        </div>
    </header>

    @foreach($group->featureInfos() as $item)
        <div class="d-flex small mb-2 px-4">

            <div class="w-100">
                <i class="fas fa-{{ $item['fa_class'] }} mr-1"></i> {{ $item['name'] }}
            </div>

            <div class="w-50 text-right">
                {{ $item['value'] }}
            </div>
        </div>
    @endforeach

    <ul class="list-group mt-4 d-none">
        @foreach(range(1, 3) as $item)
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Catégorie {{ $item }}
                <span class="badge badge-dark badge-pill">14</span>
            </li>
        @endforeach
    </ul>
</div>
