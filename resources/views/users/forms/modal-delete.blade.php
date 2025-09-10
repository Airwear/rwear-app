<!-- Modal suppression -->
<div class="modal fade" id="delete--{!! $item->id !!}" tabindex="-1" role="dialog" aria-labelledby="DeletionModalTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        {!! Form::open([
            'url' => route('users.delete', $item),
            'method' => 'DELETE'
        ]) !!}
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="DeletionModalTitle">
                     {!! trans('action.title_delete') !!}
                </h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {!! trans('action.message_delete') !!}
            </div>
            <div class="modal-footer">
                <button class="btn btn-success">
                    <i class="fas fa-check fa-fw"></i> {!! trans('action.yes') !!}
                </button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                    <i class="fas fa-times fa-fw"></i> {!! trans('action.no') !!}
                </button>
            </div>
        </div>
        {!! Form::close() !!}
    </div>
</div>
