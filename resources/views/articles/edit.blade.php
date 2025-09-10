@extends('layouts.admin', [
    'title' => $article->designation,
])

@section('heading-right')

@endsection

@section('content')
    <div class="text-right mb-4">
        <a
            class="btn btn-dark"
            href="{{ route('articles.list') }}"
        >
            <i class="fa fa-undo"></i> Retour à la liste
        </a>
    </div>
    <x-articles.edit-form :article="$article" />
@endsection

