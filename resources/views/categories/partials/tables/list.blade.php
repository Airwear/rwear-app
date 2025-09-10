<div class="table-responsive p-4 bg-white">
    <h6 class="mb-2">{{ trans('navigation.found_details', ['count' => $list->count(), 'total' => $list->total()]) }}</h6>
    <x-table class="table-hover">
        <x-thead>
            <x-th>{{ trans('labels.designation') }}</x-th>
            <x-th>{{ trans('labels.file_name') }}</x-th>
            <x-th>{{ trans('labels.active') }}</x-th>
            <x-th class="text-right">{{ trans('labels.order') }}</x-th>
            <x-th>{{ trans('labels.created_at') }}</x-th>
            <x-th class="d-flex justify-content-end">
                <x-button class="btn-success" data-bs-toggle="modal" data-bs-target="#create-model">
                    <i class="fa fa-fw fa-plus"></i>
                </x-button>
                @push('modal')
                    @include('partials.modals.forms', [
                        'title' => trans('labels.new'),
                        'target' => "create-model",
                        'route' => route('api.'.$baseRoute.'.store'),
                        'view' => "$baseView.partials.forms.create",
                    ])
                @endpush
            </x-th>
        </x-thead>

        <x-tbody class="table-body">
            @foreach($list as $item)
                <x-row class="table-row">
                    <td>{{ $item->designation }}</td>
                    <td>
                        <a href="#">{{ $item->cover }}</a>
                    </td>
                    <td>
                        <x-active :active="$item->active" />
                    </td>
                    <td class="text-right">{{ $item->order }}</td>
                    <td>{{ $item->created_at?->format('d/m/Y') }}</td>
                    <td class="d-flex justify-content-end">
                        @include("partials.lists.actions", ['model' => $item])
                    </td>
                </x-row>
            @endforeach
        </x-tbody>
    </x-table>

    @includeIf('partials.paginator')

    @if($list->isEmpty())
        <x-empty-list />
    @endif
</div>
