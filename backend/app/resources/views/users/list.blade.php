@extends('layouts.admin', ['title' =>  "Liste des utilisateurs"])

@section('content')
    <div class="text-right mb-4">
        <a href="{{ route('users.create') }}" class="btn btn-success shadow">
            <i class="fa fa-plus mr-1"></i>
            {!! trans('action.add_user') !!}
        </a>
    </div>
    @include('users.partials.list-table')
@endsection

