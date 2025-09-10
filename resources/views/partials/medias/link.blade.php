<a
    href="{!! media_url($media, $media->model->getTable()) !!}"
    data-fslightbox="vehicle-{{ $media->model->id }}"
>
    <img
        alt="Média {!!  $media->file_name !!}"
        src="{!! media_url($media, $media->model->getTable(), $preset) !!}"
        class='img-fluid'
    />
</a>
