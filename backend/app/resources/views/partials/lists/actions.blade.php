<div class="btn-group">
    <x-button class="btn-info" data-bs-toggle="modal" data-bs-target="#edit-model--{{ $model->id }}">
        <i class="fa fa-fw fa-edit"></i>
    </x-button>
    <x-button class="btn-danger" data-bs-toggle="modal" data-bs-target="#delete-model--{{ $model->id }}">
        <i class="fa fa-fw fa-trash"></i>
    </x-button>
</div>

@push('modal')
    @include('partials.modals.forms', [
        'title' => $model->designation,
        'target' => "edit-model--$model->id",
        'route' => route('api.'.$baseRoute.'.update', [$model]),
        'view' => "$baseView.partials.forms.edit",
    ])

    @include('partials.modals.forms', [
        'title' => $model->designation,
        'target' => "delete-model--$model->id",
        'route' => route('api.'.$baseRoute.'.destroy', [$model]),
        'view' => "$baseView.partials.forms.delete",
        'delete' => true,
    ])
@endpush

