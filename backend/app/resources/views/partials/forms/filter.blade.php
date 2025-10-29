{!! Form::open([
    'url' => request()->fullUrl(),
    'method' => 'GET',
    'id' => 'filter-forms'
]) !!}
    <div class="card shadow p-3 mb-3">
        <h6 class="text-uppercase">{!! trans('navigation.main_filter') !!}</h6>
        <div class="row">
            <div class="col-sm-3 col-12">
                <div class="input-group">
                    {{ Form::text('searched', request('searched'), [
                        'class' => 'form-control form-control-sm',
                    ]) }}
                    <div class="input-group-append">
                        <button class="btn btn-sm btn-success">
                            <i class="fa fa-search"></i>
                        </button>
                        <a data-toggle="tooltip" title="Initialiser la recherche" href="{!! request()->url() !!}" class="btn btn-sm btn-dark">
                            <i class="fa fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{!! Form::close() !!}
