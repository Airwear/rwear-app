@extends('layouts.admin', ['title' => $user->full_name])

@section('content')
    <div class="row">
        <div class="col-sm-6 col-12">
            {{ Form::open([
                'url' => route('users.update-me.store'),
                'method' => 'POST',
                'files' => true,
            ]) }}
                @include('users.forms.me')
            {{ Form::close() }}
        </div>

        <div class="col-sm-6 col-12">
            {{ Form::open([
                'url' => route('users.update-me.password'),
                'method' => 'POST',
            ]) }}
                @include('users.forms.password')
            {{ Form::close() }}
        </div>
    </div>
@endsection

