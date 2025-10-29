{!! Form::open([
    'url' => request()->fullUrl(),
    'method' => 'GET',
    'id' => 'filter-forms'
]) !!}
    <div class="card p-3 mb-3">
        <h6 class="text-uppercase">{!! trans('auth.users_filter') !!}</h6>
        <div class="row">
            <div class="col-sm-3 col-12">
                {{ Form::select('category_id', $categories ?? [], request('category_id'), [
                    'class' => 'form-control form-control-sm custom-select custom-select-sm',
                    'onchange' => 'this.form.submit()'
                ]) }}
            </div>
            <div class="col-sm-3 col-12">
                <div class="input-group">
                    {{ Form::text('searched', request('searched'), [
                        'class' => 'form-control form-control-sm',
                        'placeholder' => "Ex : Cardio"
                    ]) }}
                    <div class="input-group-append">
                        <button data-toggle="tooltip" class="btn btn-sm btn-success">
                            <i class="fa fa-search"></i>
                        </button>
                        <a data-toggle="tooltip" title="Initialiser la recherche" href="{!! route('trainings.list') !!}" class="btn btn-sm btn-dark">
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
