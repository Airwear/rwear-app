<div class="card shadow p-3 table-responsive">
    <h6>
        {{ $list->count() }} élément(s) trouvé(s)
    </h6>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Création</th>
                <th></th>
            </tr>
        </thead>

        <tbody>
        @foreach($list as $item)
            <tr>
                <td>{!! highlight($item->designation, $searched) !!}</td>
                <td>{!! highlight($item->email, $searched) !!}</td>
                <td>{!! highlight($item->phone, $searched) !!}</td>
                <td>{{ optional($item->created_at)->format('d/m/Y')}}</td>
                <td align="right">
                    <a data-toggle="tooltip" href="{{ route('groups.edit', $item) }}" class="btn btn-primary btn-sm" title="{{ trans('action.edit') }}">
                        <i class="fas fa-edit fa-fw"></i> {{ trans('action.edit') }}
                    </a>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @include('partials.paginator')
    @if($list->isEmpty())
        <h6>{{ trans('navigation.empty_list') }}</h6>
    @endif
</div>

