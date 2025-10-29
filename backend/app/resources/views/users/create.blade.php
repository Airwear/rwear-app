@extends('layouts.admin', ['title' => trans('auth.add_new_title')])

@section('content')
    @include('users.partials.back-to-list')
    {{ Form::open([
        'url' => route('users.store'),
        'method' => 'POST',
    ]) }}
        @include('users.partials.forms')
    {{ Form::close() }}
@endsection

