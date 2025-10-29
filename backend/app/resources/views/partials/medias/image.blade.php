@foreach($medias as $media)
    @if($disk)
        <div class="text-center">
            <a
                href="{!! media_url($media, $disk) !!}"
                data-fslightbox="vehicle-{{ $media->model->id }}"
            >
                <img
                    alt="{!!  $media->file_name !!}"
                    src="{!! media_url($media, $disk, $preset) !!}"
                    class='img-fluid'
                />
            </a>
            <div class="small text-muted text-left mt-2">
                <span title="{{ $media->file_name }}">Nom: {{ $media->file_name }}</span> <br/>
                Taille: {{ amount_format(($media->size ?? 1 )/ 1000) }} Ko<br/>
                Modification {{ $media->updated_at->format('d/m/Y H:i') }}<br/>
            </div>
        </div>
    @endif
@endforeach
