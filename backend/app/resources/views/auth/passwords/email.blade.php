@extends('layouts.auth', [
    'title' => trans('auth.forgot_your_password')
])

@section('content')
    <p class="text-center">{!! trans('auth.message_forget_password') !!}</p>
    @if (session('status'))
        <div class="alert alert-success text-center">{{ session('status') }}</div>
    @endif
    <form method="POST" action="{{ route('password.email') }}">
        @csrf
        <div class="form-group">
            <div class="input-group">
                <input type="email" placeholder="{!! trans('auth.email') !!}" name="email" required class="form-control form-control-lg" aria-label="Email">
                <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
            @include('partials.forms.error', ['name' => 'email'])
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <div>
                <a href="{!! route('login') !!}" class="text-decoration-none">
                    <i class="fa fa-arrow-left mr-2"></i>
                    {!! trans('auth.btn_return_to_login') !!}
                </a>
            </div>
            @include('partials.forms.btn-auth', ['title' => trans('auth.reset_email')])
        </div>
    </form>
@endsection
