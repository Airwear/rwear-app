<div class="bg-white px-2 py-4 mb-2">
    <header class="text-center">
        <h1 class="h6 font-weight-bold text-uppercase">
            Photo de couverture
        </h1>

        @if($model->image)
            <div class="my-1">
                <a
                    href="{!! media_url($model->image, $model->getTable()) !!}"
                    data-fslightbox="model-{{ $model->id }}"
                >
                    <img
                        alt="{!!  $model->designation !!}"
                        src="{!! media_url($model->image, $model->getTable()) !!}"
                        class='img-fluid'
                        width="200"
                    />
                </a>
            </div>
        @endif

        @include('partials.forms.images')
    </header>
</div>
