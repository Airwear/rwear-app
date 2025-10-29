@extends('layouts.admin', [
    'title' => trans("$baseView.title_list")
])

@section('content')
    @include("$baseView.partials.tables.list")
@endsection

