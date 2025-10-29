@extends('layouts.admin', ['title' =>  'Mes articles'])

@section('content')
    <div class="text-right mb-4">
        <button
            class="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#create"
        >
            <i class="fa fa-plus"></i> Ajouter
        </button>
    </div>
    @include('articles.partials.cards.filter')
    @include('articles.partials.list-table')
@endsection

@push('modal')
    @include('articles.partials.modals.create')
@endpush


