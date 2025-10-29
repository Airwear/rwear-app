@extends('layouts.admin', ['title' =>  trans('roles.title_create')])

@section('content')
    <div class="text-right mb-4">
        <a href="{{ route('admin.users.roles.list') }}" class="btn btn-dark">
            <i class="fa fa-undo mr-2"></i>
            {!! trans('navigation.back_to_list') !!}
        </a>
    </div>
    {!! Form::open([
        'url' => route('admin.users.roles.store'),
        'method' => 'PUT'
    ]) !!}
        @include('admin.users.roles.forms.info')
    {!! Form::close() !!}
@endsection

