<!-- Modal delete -->
<div class="modal fade" id="delete-media--{!! $media->id !!}" tabindex="-1" role="dialog" aria-labelledby="DeletionModalTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        {!! Form::open([
            'url' => route('admin.medias.delete', ['mediaId' => $media->id]),
            'method' => 'DELETE'
        ]) !!}
            <div class="modal-content text-left">
                <div class="modal-header">
                    <h5 class="modal-title">{!! trans('media.delete_title') !!}</h5>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    {!! trans('media.delete_message', ['name' => $media->file_name]) !!}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" type="submit" name="_action" value="soft-delete">
                        <i class="fas fa-check fa-fw"></i> {!! trans('navigation.action_yes') !!}
                    </button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                        <i class="fas fa-times fa-fw"></i> {!! trans('navigation.action_no') !!}
                    </button>
                </div>
            </div>
        {!! Form::close() !!}
    </div>
</div>

