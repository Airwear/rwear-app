<div class="card shadow p-3">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>{{ trans('roles.display_name') }}</th>
                <th>{{ trans('roles.permissions') }}</th>
                <th></th>
            </tr>
        </thead>

        <tbody>
        @foreach($list as $item)
            <tr>
                <td>
                    {!! $item->display_name !!}
                </td>

                <td>
                    <span data-bs-toggle="tooltip" class="badge badge-success" title="Nombre de permission">
                        {!! $item->permissions_count !!}
                    </span>
                </td>

                <td align="right">
                    <div class="btn-group btn-group-sm">
                        <a data-toggle="tooltip" title="{{ trans('action.edit') }}" href="{{ route('users.roles.edit', [$item]) }}" class="btn btn-primary">
                            <i class="fas fa-edit fa-fw"></i> {{ trans('action.edit') }}
                        </a>

                        {{--<button class="btn btn-danger"
                           data-bs-toggle="modal"
                           data-bs-target="#delete--{!! $item->id !!}"
                                data-toggle="tooltip" title="{{ trans('action.delete') }}">
                            <i class="fas fa-trash fa-fw"></i> {{ trans('action.delete') }}
                        </button>--}}
                    </div>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @if($list->isEmpty())
        <h6>{{ trans('navigation.empty_list') }}</h6>
    @endif
</div>

{{--@foreach($list as $item)
    @include('users.roles.forms.delete')
@endforeach--}}

