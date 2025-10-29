@if (auth()->user()->is_super_admin)
    @if ($item->id == auth()->id())
        {!! Form::button('<i class="fa fa-user-secret"></i><span class="sr-only"> ' . trans('impersonate.btn_start') . '</span>', [
            'type'        => 'button',
            'class'       => 'btn btn-secondary',
            'title'       => trans('impersonate.tooltip_cannot_impersonate_yourself'),
            'data-toggle' => 'tooltip',
            'disabled',
        ]) !!}
    @elseif ($item->is_super_admin)
        {!! Form::button('<i class="fa fa-user-secret"></i><span class="sr-only"> ' . trans('impersonate.btn_start') . '</span>', [
            'type'        => 'button',
            'class'       => 'btn btn-secondary',
            'title'       => trans('impersonate.tooltip_cannot_impersonate_super_admin'),
            'data-toggle' => 'tooltip',
            'disabled',
        ]) !!}
    @else
        <a href="{!! route('impersonate', $item->id) !!}"
            class="btn btn-secondary"
            title="{!! trans('impersonate.tooltip_impersonate', ['name' => e($item->fullName)]) !!}"
            data-toggle="tooltip">
                <i class="fa fa-user-secret"></i>
                <span class="sr-only">
                    {!! trans('impersonate.btn_start') !!}
                </span>
        </a>
    @endif
@endif
