@extends('layouts.admin', [
    'title' => trans('navigation.dashboard'),
    'headingInfo' => false,
])

@section('heading-info')

@endsection

@section('content')
    <div class="row">
        <div class="col-12 col-md-4 mb-4 mb-sm-0">
            @include('partials.indicators.indicator',[
                'title' => 'Categories',
                'number' => $categoryCount,
                'fa' => 'box',
            ])
        </div>

        <div class="col-12 col-md-4 mb-4 mb-sm-0">
            @include('partials.indicators.indicator',[
                'title' => 'Videos',
                'number' => $trainingCount,
                'fa' => 'video',
            ])
        </div>

        <div class="col-12 col-md-4 mb-4 mb-sm-0">
            @include('partials.indicators.indicator',[
                'title' => 'Coaches',
                'number' => $coachCount,
                'fa' => 'running',
            ])
        </div>
    </div>
    <hr />

    @include('trainings.partials.tables.user-list', ['list' => $userTrainings])
    <hr />
    @include('users.partials.list-last-connection-table', ['list' => $lastConnectedUsers])
@endsection


