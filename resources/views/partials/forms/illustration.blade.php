<div class="mb-3 d-flex">
    <div class="position-relative">

        <label
            class="text-center d-block text-uppercase rounded" for="image"
            style="height: 150px; width: 150px; background: url('{!! asset($url) !!}') no-repeat 50% 50%; background-size: contain;"
        >
            {{--<input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                style="width: 0.1px; height: 0.1px; z-index: -100"
            >--}}

            @if(empty($media))
                <i class="fa fa-image fa-3x text-white" style="margin-top: 86px"></i>
            @endif
        </label>
        <div id="image-info" class="text-center"></div>
        @include('partials.forms.error', ['name' => 'image'])

        <div style="top:1px; right: 10px" class="position-absolute">
            @if(! empty($media))
                <div class="d-flex justify-content-between mt-1">
                    <a href="#"
                       type="button"
                       data-bs-toggle="modal"
                       data-bs-target="#delete-media--{!! $media->id !!}"
                       class="text-danger btn btn-sm btn-light"
                    >
                        <i class="fa fa-trash"></i>
                    </a>
                </div>
                @push('modal')
                    @include('partials.forms.delete-media')
                @endpush
            @endif
        </div>
    </div>

    <div class="px-2">
        <h5>{!! trans('media.title_illustration') !!}</h5>

        <div>
            {!! trans('media.text_illustration') !!}
        </div>
    </div>
</div>



@push('scripts')
    <script>
        function handleImagesInfo() {
            $('#image').change(function () {
                const file = $(this)[0].files[0];
                $('#image-info').html(file.name)

            });
        }
    </script>
@endpush

@push('DOMLoaded')
    //handleImagesInfo()
@endpush
