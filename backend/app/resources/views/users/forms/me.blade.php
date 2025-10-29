<div class="card">
    <div class="card-header text-dark clearfix">
        {!! trans('auth.title_info') !!}
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-sm-6 col-12">
                @include('partials.forms.text', [
                    'label' => trans('auth.first_name'),
                    'name' => 'first_name',
                    'value' => $user->first_name,
                ])
            </div>
            <div class="col-sm-6 col-12">
                @include('partials.forms.text', [
                    'label' => trans('auth.last_name'),
                    'name' => 'last_name',
                    'value' => $user->last_name,
                ])
            </div>
        </div>

        <div class="row">
            <div class="col-sm-6 col-12">
                @include('partials.forms.text', [
                    'label' => trans('auth.email'),
                    'name' => 'email',
                    'value' => $user->email,
                ])
            </div>
            <div class="col-sm-6 col-12">
                @include('partials.forms.text', [
                    'label' => trans('auth.phone'),
                    'name' => 'phone',
                    'value' => $user->phone,
                ])
            </div>
        </div>
        @include('partials.forms.btn-submit')
    </div>
</div>
