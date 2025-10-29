<div class="card shadow p-3 table-responsive">
    <div class="card-header">
        Dernieres connexions : {{ $list->count() }}
    </div>
    <table class="table table-hover table-sm">
        <thead>
            <tr>
                <th>Nom complet</th>
                <th>Dernière connexion</th>
                <th class="text-right">Vidéos lues</th>
            </tr>
        </thead>

        <tbody>
        @foreach($list as $item)
            <tr>
                <td>{{ $item->full_name }}</td>
                <td>{{ optional($item->last_connection)->format('d/m/Y H:i')}}</td>
                <td class="text-right">{{ $item->trainings_count }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @if($list->isEmpty())
        <h6>{{ trans('navigation.empty_list') }}</h6>
    @endif
</div>

