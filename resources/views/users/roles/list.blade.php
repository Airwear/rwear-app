@extends('layouts.admin', ['title' =>  trans('roles.title_list')])

@section('content')
    @include('users.roles.partials.list-table')
@endsection

