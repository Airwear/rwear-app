@extends('layouts.home', [
    'title' => config('app.name'),
])

@section('content')

    <div class="mb-4">
        <strong>{!! config('app.name') !!}</strong> (<b>L</b>e <b>P</b>etit <b>C</b>omptable), est votre assistant automatisé, de suivie des ventes. Grâce à lui, vous pouvez :
    </div>

    <div class="row">
        <div class="col-lg-4 col-sm-12 col-md-12 col-12 mb-sm-0 my-4">
            <h4>
                <i class="fa fa-box mr-1"></i>
                Enregistrer vos articles
            </h4>
            <p>Renseignez ou importez tous vos articles et leurs prix de vente respectifs</p>
        </div>

        <div class="col-lg-4 col-sm-12 col-md-12 col-12 mb-sm-0 my-4">
            <h4>
                <i class="fa fa-list mr-1"></i>
                Gérer vos stocks
            </h4>
            <p>A chacune de vos ventes, les quantités sont automatiquement décomptées en stock</p>
        </div>

        <div class="col-lg-4 col-sm-12 col-md-12 col-12 mb-sm-0 my-4">
            <h4>
                <i class="fa fa-calculator mr-1"></i>
                Suivre vos ventes
            </h4>
            <p>Comptabilisez et tracez l'évolution de vos ventes sur des périodes de votre choix.</p>
        </div>


        <div class="col-lg-4 col-sm-12 col-md-12 col-12 mb-sm-0 my-4">
            <h4>
                <i class="fa fa-check-double mr-1"></i>
                C'est tout !
            </h4>
            <p>Déléguez désormais ces tâches à votre assistant en toute quiétude.</p>
        </div>
    </div>
@endsection
