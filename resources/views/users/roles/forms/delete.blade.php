<!-- Modal suppression -->
<div class="modal fade" id="delete--{!! $item->id !!}" tabindex="-1" role="dialog" aria-labelledby="DeletionModalTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        {!! Form::open([
            'url' => route('admin.users.roles.delete', $item),
            'method' => 'DELETE'
        ]) !!}
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="DeletionModalTitle">
                     {!! trans('roles.title_delete') !!}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {!! trans('roles.message_delete') !!}
            </div>
            <div class="modal-footer">
                <button class="btn btn-success">
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
