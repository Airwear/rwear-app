<a
    data-bs-toggle="tooltip"
    title="{!! $title ?? null !!}"
    href="{!! route('admin.medias.download', ['mediaId' => $media->id]) !!}"
    class="btn btn-secondary"
>
    <i class="fa {!! mime_type_icon($media->mime_type) !!}"></i> {!! trans('media.download') !!}
</a>
