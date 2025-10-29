<div class="btn-group btn-group-sm text-nowrap text-right" role="group">
    <a data-toggle="tooltip" href="{{ route('users.edit', $item) }}" class="btn btn-primary btn-sm" title="{{ trans('action.edit') }}">
        <i class="fas fa-edit fa-fw"></i>
    </a>
    <button
        class="btn btn-danger btn-sm "
        data-bs-toggle="modal"
        data-bs-target="#delete--{!! $item->id !!}"
        title="{{ trans('action.delete') }}"
    >
        <i class="fa fa-trash"></i>
    </button>
</div>
@push('modal')
    @include('users.forms.modal-delete')
@endpush
