<div class="card shadow p-3 table-responsive">
    <h6>
        {{ $list->count() }} élément(s) trouvé(s)
    </h6>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Désignation</th>
                <th class="text-right">Quantité</th>
                <th>Unité</th>
                <th>Prix</th>
                <th>Prix Promo</th>
                <th></th>
            </tr>
        </thead>

        <tbody>
        @foreach($list as $item)
            <tr>
                <td>{!! highlight($item->designation, $searched) !!}</td>
                <td class="text-right">{!! $item->quantity !!}</td>
                <td>{!! $item->unit?->designation !!}</td>
                <td>{{ amount_format($item->price) }}</td>
                <td>{{ amount_format($item->promotion_price) }}</td>
                <td align="right">
                    <a data-toggle="tooltip" href="{{ route('articles.edit', $item) }}" class="btn btn-primary btn-sm" title="{{ trans('action.edit') }}">
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

