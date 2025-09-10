@extends('layouts.auth', [
    'title' => trans('auth.auth.confirm_password_title')
])

@section('content')
    <form method="POST" action="{{ route('password.confirm') }}">
        @csrf

        @include('partials.forms.text', [
            'label' => trans('auth.secret'),
            'name' => 'email',
            'type' => 'password',
            'required' => true
        ])

        @include('partials.forms.btn-submit')

        <div class="">
            @if (Route::has('password.request'))
                <a class="btn btn-link" href="{{ route('password.request') }}">
                    {{ trans('auth.forgot_your_password') }}
                </a>
            @endif
        </div>
    </form>
@endsection
