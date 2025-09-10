@extends('layouts.admin', ['title' =>  'Groupes'])

@section('content')
    <div class="text-right mb-4">
        <button
            class="btn btn-success btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#create"
        >
            <i class="fa fa-plus"></i> Ajouter
        </button>
    </div>
    @include('groups.partials.list-table')
@endsection

@push('modal')
    @include('groups.partials.modals.create')
@endpush


