<div class="bg-white px-2 py-4">
    <header class="text-center">

        <h1 class="h6 font-weight-bold text-uppercase">
            Photo de {{ $article->designation }}
        </h1>

        @if($article->image)
            <div class="my-1">
                <a
                    href="{!! media_url($article->image, $article->getTable()) !!}"
                    data-fslightbox="vehicle-{{ $article->id }}"
                >
                    <img
                        alt="{!!  $article->designation !!}"
                        src="{!! media_url($article->image, $article->getTable()) !!}"
                        class='img-fluid'
                        width="200"
                    />
                </a>
            </div>
        @endif

        @include('partials.forms.images')
    </header>
</div>
