<?php

use Illuminate\Support\Facades\Route;

Route::get('/list')
    ->uses('ListController@index')
    ->name('list');

Route::get('/create')
    ->uses('CreateController@create')
    ->name('create');

Route::post('/store')
    ->uses('CreateController@store')
    ->name('store');

Route::get('{group}/details')
    ->uses('UpdateController@edit')
    ->name('edit');

Route::post('{group}/update')
    ->uses('UpdateController@update')
    ->name('update');

