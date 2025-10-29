{!! Form::open([
    'url' => request()->fullUrl(),
    'method' => 'GET',
    'id' => 'filter-forms'
]) !!}
    <div class="card shadow p-3 mb-3">
        <h6 class="text-uppercase">{!! trans('auth.users_filter') !!}</h6>
        <div class="row">
            <div class="col-sm-3 col-12">
                <div class="input-group">
                    {{ Form::text('searched', $searched, [
                        'class' => 'form-control form-control-sm',
                        'placeholder' => "Nom d'article"
                    ]) }}
                    <div class="input-group-append">
                        <button data-toggle="tooltip" title="Valider la recherche" class="btn btn-sm btn-success">
                            <i class="fa fa-search"></i>
                        </button>
                        <a data-toggle="tooltip" title="Initialiser la recherche" href="{!! route('articles.list') !!}" class="btn btn-sm btn-dark">
                            <i class="fa fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{!! Form::close() !!}

@push('scripts')
@endpush

@push('DOMLoaded')
@endpush
