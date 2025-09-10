@include('users.forms.filter')

<div class="card shadow p-3">
    <h6>
        {!! trans('auth.users_total', [
            'count' => $list->count(),
            'total' => $list->total(),
        ]) !!}
    </h6>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Création</th>
                <th>Dernière connexion</th>
                <th></th>
            </tr>
        </thead>

        <tbody>
        @foreach($list as $item)
            <tr>
                <td>{!! highlight($item->full_name, $searched) !!}
                    @if($item->is_super_admin)
                        <br> <span class="badge badge-info">
                            {{ trans('auth.super_admin') }}
                        </span>
                    @endif
                </td>
                <td>{!! highlight($item->email, $searched) !!}</td>
                <td>{{ optional($item->created_at)->format('d/m/Y')}}</td>
                <td>{{ optional($item->logged_at)->format('d/m/Y H:i')}}</td>
                <td align="right">
                    @if(! $item->is_super_admin && $item->isNot(auth()->user()))
                        @include('users.partials.list-actions')
                    @endif
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

