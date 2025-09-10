<div class="row">
    @foreach($medias as $media)

        <div class='col-sm-3 col-12 mb-2'>
            <button
                type="button"
                class='position-absolute btn btn-sm btn-danger border-0'
                style="right: 10px"
                data-bs-toggle="modal"
                data-bs-target="#trashMedia--{!! $media->id !!}"
            >
                <i class="fa fa-fw fa-trash"></i>
            </button>

            <div class="text-center">
                @include('partials.medias.link', ['preset' => 'medium'])
                <div class="small text-muted text-left mt-2">
                    <span title="{{ $media->file_name }}">Nom: {{ \Illuminate\Support\Str::limit($media->file_name, 12) }}</span> <br/>
                    Taille: {{ amount_format(($media->size ?? 1 )/ 1000) }} Ko<br/>
                    Modification {{ $media->updated_at->format('d/m/Y H:i') }}<br/>
                </div>
            </div>
        </div>

        @push('modal')
        <!-- Modal -->
            <div class="modal fade" id="trashMedia--{!! $media->id !!}" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        {!! Form::open([
                            'url' => route('medias.delete', $media->id),
                            'method' => 'DELETE'
                        ]) !!}
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Suppression du média</h5>
                        </div>
                        <div class="modal-body">
                            Voulez-vous supprimer le média {!! $media->name !!} ?
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-success"><i class="fa fa-check mr-1"></i>Oui</button>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"><i class="fa fa-times mr-1"></i>Non</button>
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        @endpush
    @endforeach
</div>
