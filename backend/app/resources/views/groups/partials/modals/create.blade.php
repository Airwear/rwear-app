<!-- Modal suppression -->
<div class="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="Creation" aria-hidden="true">
    <div class="modal-dialog" role="document">
        {!! Form::open([
            'url' => route('groups.store'),
            'method' => 'POST'
        ]) !!}
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="DeletionModalTitle">
                     Nouveau groupe
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                @include('partials.forms.text', [
                    'name' => 'designation',
                    'label' => 'Désignation',
                    'value' => old('designation'),
                    'required' => true,
                ])
            </div>
            <div class="modal-footer">
                <button class="btn btn-success">
                    <i class="fas fa-check fa-fw"></i> Valider
                </button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                    <i class="fas fa-times fa-fw"></i> Annuler
                </button>
            </div>
        </div>
        {!! Form::close() !!}
    </div>
</div>
