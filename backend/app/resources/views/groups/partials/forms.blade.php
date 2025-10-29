
{!! Form::open([
    'url' => route('groups.update', $group),
    'method' => 'POST'
]) !!}

    @include('partials.forms.text', [
        'name' => 'designation',
        'label' => 'Désignation',
        'value' => $group->designation,
        'required' => true,
    ])

    @include('partials.forms.textarea', [
        'name' => 'description',
        'label' => 'Description',
        'value' => $group->description,
    ])

    @include('partials.forms.textarea', [
        'name' => 'address',
        'label' => 'Adresse',
        'value' => $group->address,
    ])

    <div class="row">
        <div class="col-md-6 col-12">
            @include('partials.forms.text', [
                'name' => 'city',
                'label' => 'Ville',
                'value' => $group->city,
            ])
        </div>
        <div class="col-md-6 col-12">
            @include('partials.forms.text', [
                'name' => 'zip_code',
                'label' => 'Code ou boîte postal(e)',
                'value' => $group->zip_code,
            ])
        </div>
    </div>

    <div class="row">
        <div class="col-md-6 col-12">
            @include('partials.forms.text', [
                'name' => 'email',
                'label' => 'Email',
                'value' => $group->email,
            ])
        </div>
        <div class="col-md-6 col-12">
            @include('partials.forms.text', [
                'name' => 'phone',
                'label' => 'Téléphone',
                'value' => $group->phone,
            ])
        </div>
    </div>

    @include('partials.forms.text', [
        'name' => 'currency',
        'label' => 'Device',
        'value' => $group->currency,
    ])

    @include('partials.forms.text', [
        'name' => 'web_site_url',
        'label' => 'Site web',
        'value' => $group->web_site_url,
    ])

    <div class="row">
        <div class="col-md-6 col-12">
            @include('partials.forms.checkbox', [
                'name' => 'accept_click_on_collect',
                'label' => 'Accepte le Click and Collect',
                'checked' => $group->accept_click_on_collect,
            ])
        </div>
        <div class="col-md-6 col-12">
            @include('partials.forms.checkbox', [
                'name' => 'accept_payment_on_line',
                'label' => 'Accepte le paiement en ligne',
                'checked' => $group->accept_payment_on_line,
            ])
        </div>
    </div>

    @include('partials.forms.checkbox', [
        'name' => 'active',
        'label' => 'Cette boutique est active',
        'checked' => $group->active,
    ])

    @include('partials.forms.btn-submit')
{!! Form::close() !!}
