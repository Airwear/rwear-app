@extends('layouts.auth', [
    'title' => trans('auth.login_title')
])

@section('content')
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div class="form-group">
            <input type="email" placeholder="{!! trans('auth.email') !!}" name="email" required class="form-control form-control-lg" aria-label="Email">
            @include('partials.forms.error', ['name' => 'email'])
        </div>

        <div class="form-group">
            <input type="password" name="password" placeholder="{!! trans('auth.secret') !!}" required class="form-control form-control-lg" aria-label="Password">
            @include('partials.forms.error', ['name' => 'password'])
        </div>

        <div class="form-group d-none">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                <label class="form-check-label" for="remember">
                    {{ trans('auth.remember_me') }}
                </label>
            </div>
        </div>

        @include('partials.forms.btn-auth')

        <div class="d-flex justify-content-start align-items-center">
            <a class="btn btn-link text-primary text-decoration-none" href="{{ route('password.request') }}">
                {{ trans('auth.forgot_your_password') }}
            </a>
        </div>
    </form>
@endsection
