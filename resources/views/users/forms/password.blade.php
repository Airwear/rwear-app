<div class="card mb-4">
    <div class="card-header text-dark clearfix">
        Mot de passe
    </div>
    <div class="card-body">

        @include('partials.forms.text', [
            'label' => trans('auth.old_password'),
            'name' => 'old_password',
            'type' => 'password',
            'value' => '',
        ])

        @include('partials.forms.text', [
            'label' => trans('auth.new_password'),
            'name' => 'new_password',
            'type' => 'password',
            'value' => '',
        ])

        @include('partials.forms.text', [
            'label' => trans('auth.new_password_confirmation'),
            'name' => 'new_password_confirmation',
            'type' => 'password',
            'value' => '',
        ])

        <div>
            <h6 class="font-weight-bold">{!! trans('passwords.rules') !!}</h6>
            <div class="px-4">
                @foreach(range(1, 6) as $index)
                    <div>
                        <i class="fa fa-times mr-2 text-danger"></i>
                        {!! trans('passwords.rule_'.$index) !!}
                    </div>
                @endforeach
            </div>
        </div>

        @include('partials.forms.btn-submit')
    </div>
</div>
