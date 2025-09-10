@extends('layouts.admin', ['title' => $user->full_name])

@section('content')
    @include('users.partials.back-to-list')
    {{ Form::open([
        'url' => route('users.update', $user),
        'method' => 'PUT',
        'files' => true,
    ]) }}
        @include('users.partials.forms')
    {{ Form::close() }}
@endsection

