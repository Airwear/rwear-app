<div class="table-responsive p-4 bg-white">
    <h6 class="mb-2">{{ trans('navigation.found_details', ['count' => $list->count(), 'total' => $list->total()]) }}</h6>
    <x-table class="table-hover">
        <x-thead>
            <x-th style="width: 60px"></x-th>
            <x-th>{{ trans('labels.designation') }}</x-th>
            <x-th>Catégorie</x-th>
            <x-th>Niveau</x-th>
            <x-th>Durée (min)</x-th>
            <x-th>Coach</x-th>
            <x-th>Enregistrée le</x-th>
            <x-th>Publiée le</x-th>
            <x-th>Vidéo</x-th>
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
                <x-row class="table-row" style="border-left: 5px solid {{ $item->category?->color }}">
                    <td>
                        @if($item->image_cover)
                            <img width="50" src="{{ $item->image_cover }}" alt="{{ $item->designation }}" class="img-thumbnail">
                        @endif
                    </td>
                    <td>{!! highlight($item->designation, request('searched')) !!}</td>
                    <td>{!! highlight($item->category?->designation, request('searched')) !!}</td>
                    <td>{{ $item->level?->designation }}</td>
                    <td>{{ $item->duration_in_minute }}</td>
                    <td>{{ $item->coach?->designation }}</td>
                    <td>{{ $item->register_date?->format('d/m/Y') }}</td>
                    <td>{{ $item->publish_date?->format('d/m/Y') }}</td>
                    <td>
                        <i class="fa fa-fw fa-{{ !empty($item->url) ? 'check text-success' : 'times text-danger' }}"></i>
                    </td>
                    <td class="d-flex justify-content-end">
                        <a class="btn btn-info mx-2" href="{{ route("$baseRoute.edit", $item) }}">
                            <i class="fa fa-fw fa-edit"></i>
                        </a>

                        <x-button class="btn-danger" data-bs-toggle="modal" data-bs-target="#delete-model--{{ $item->id }}">
                            <i class="fa fa-fw fa-trash"></i>
                        </x-button>

                        @push('modal')
                            @include('partials.modals.forms', [
                                'title' => $item->designation,
                                'target' => "delete-model--$item->id",
                                'route' => route('api.'.$baseRoute.'.destroy', [$item]),
                                'view' => "$baseView.partials.forms.delete",
                                'delete' => true,
                            ])
                        @endpush

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
