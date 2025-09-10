@extends('layouts.auth', [
    'title' => trans('auth.title_reset_password')
])

@section('content')
    <form method="POST" action="{{ route('password.update') }}">
        @csrf

        <input type="hidden" name="token" value="{{ $token }}">
        <input type="hidden" name="email" value="{{ request('email') }}">

        <div class="form-group">
            <div class="input-group">
                <input type="password" placeholder="{!! trans('auth.secret') !!}" name="password" required class="form-control form-control-lg" aria-label="password">
                <span class="input-group-text">
                    <i class="fas fa-key"></i>
                </span>
            </div>
            @include('partials.forms.error', ['name' => 'password'])
        </div>

        <div class="form-group">
            <div class="input-group">
                <input type="password" placeholder="{!! trans('auth.secret_confirmation') !!}" name="password_confirmation" required class="form-control form-control-lg" aria-label="password_confirmation">
                <span class="input-group-text">
                    <i class="fas fa-key"></i>
                </span>
            </div>
            @include('partials.forms.error', ['name' => 'password_confirmation'])
        </div>

        @include('partials.forms.btn-auth')

    </form>
@endsection
