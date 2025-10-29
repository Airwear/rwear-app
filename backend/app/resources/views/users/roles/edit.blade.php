@extends('layouts.admin', ['title' =>  trans('roles.title_edit', ['name' => $role->display_name])])

@section('content')
    <div class="text-right mb-4">
        <a href="{{ route('users.roles.list') }}" class="btn btn-dark">
            <i class="fa fa-undo mr-2"></i>
            {!! trans('navigation.back_to_list') !!}
        </a>
    </div>
    {!! Form::open([
        'url' => route('users.roles.update', $role),
        'method' => 'PUT'
    ]) !!}
        @include('users.roles.forms.info')
        @include('users.roles.forms.permissions')
    {!! Form::close() !!}
@endsection
