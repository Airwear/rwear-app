@extends('layouts.admin', [
    'title' => $group->designation,
])

@section('heading-right')

@endsection

@section('content')
    <div class="row">
        <div class="col-md-4 col-12">
            @include('groups.partials.web.info')
        </div>
        <div class="col-md-8 col-12">

        </div>
    </div>
@endsection

