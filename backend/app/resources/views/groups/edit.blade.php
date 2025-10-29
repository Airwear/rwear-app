@extends('layouts.admin', [
    'title' => $group->designation,
])

@section('heading-right')

@endsection

@section('content')

    <div class="row">
        <div class="col-md-5 col-12">
            @include('groups.partials.forms')
        </div>
    </div>

    <br/>

    <section class="mt-4 card p-4 shadow-sm">
        <h3 class="text-uppercase text-info">Aperçu de la page de votre boutique en ligne</h3>
        <p>Ceci est la page que vos visiteurs veront lorsqu'ils visiteront votre boutique en ligne</p>
        <div class="row">
            <div class="col-md-3 col-12">
                @include('groups.partials.web.info')
            </div>
            <div class="col-md-9 col-12">
                @include('groups.partials.web.details')
            </div>
        </div>
    </section>
@endsection

