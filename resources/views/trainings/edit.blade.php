@extends('layouts.admin', [
    'title' => $model->designation
])

@section('content')

    <div class="d-flex justify-content-end mb-4">
        <a href="{{ route("$baseView.list") }}" class="btn btn-dark">
            <i class="fa fa-fw fa-undo"></i> Retour à la liste
        </a>
    </div>

    <form
        action="{{ route("$baseView.update", $model) }}"
        method="POST"
        enctype="multipart/form-data"
    >

        @method('POST')
        @csrf

        <div class="row">
            @include("$baseView.partials.forms.edit")
        </div>

        <div class="d-flex justify-content-end">
            <x-btn class="btn-success">
                <i class="fa fa-save"></i> {{ trans('action.save') }}
            </x-btn>
        </div>

    </form>
@endsection

