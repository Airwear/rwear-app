<?php

// https://github.com/diglactic/laravel-breadcrumbs
use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Home
Breadcrumbs::for('admin.dashboard', function (BreadcrumbTrail $trail) {
    $trail->push(trans('navigation.home'), route('admin.dashboard'));
});
