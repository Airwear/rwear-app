<div class="table-responsive p-4 bg-white">
    <h6 class="mb-2">
        Les 20 dernières vidéos consultées : {{ $list->total() }}
    </h6>
    <x-table class="table-hover">
        <x-thead>
            <x-th>Nom</x-th>
            <x-th>Vidéo</x-th>
            <x-th>Durée</x-th>
            <x-th>Vues</x-th>
            <x-th>MAJ</x-th>
        </x-thead>

        <x-tbody class="table-body">
            @foreach($list as $item)
                <x-row class="table-row">
                    <td>{!! $item->user->full_name !!}</td>
                    <td>
                        <a target="_blank" href="{{ route('trainings.edit', $item->training) }}">
                            {!! $item->training->designation !!}
                        </a>
                    </td>
                    <td>
                        @if($item->spend_time)
                            {!! $item->timer_in_seconds !!}s / {!! $item->timer_in_minutes !!}min
                        @endif
                    </td>
                    <td>{{ $item->view_count }}</td>
                    <td>{{ $item->updated_at->format('d/m/Y') }}</td>
                </x-row>
            @endforeach
        </x-tbody>
    </x-table>

    @includeIf('partials.paginator')

    @if($list->isEmpty())
        <x-empty-list />
    @endif
</div>
