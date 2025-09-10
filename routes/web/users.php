<?php

Route::middleware(['can:manage users'])->group(function () {
    Route::get('/list')
        ->uses('ListController@index')
        ->name('list');

    Route::get('/create')
        ->uses('CreateController@create')
        ->name('create');

    Route::post('/store')
        ->uses('CreateController@store')
        ->name('store');

    Route::get('{user}/edit')
        ->uses('UpdateController@edit')
        ->name('edit');

    Route::put('/{user}/update')
        ->uses('UpdateController@update')
        ->name('update');

    Route::post('/{user}/set-locale')
        ->uses('UpdateController@setLocale')
        ->name('set-locale');

    Route::delete('/{user}/delete')
        ->uses('DeleteController@delete')
        ->name('delete');

    Route::prefix('roles')
        ->middleware(['can:manage all'])
        ->name('roles.')
        ->namespace('Roles')
        ->group(function () {
            Route::get('/list')
                ->uses('ListController@index')
                ->name('list');

            Route::get('create')
                ->uses('CreateController@create')
                ->name('create');

            Route::put('store')
                ->uses('CreateController@store')
                ->name('store');

            Route::get('{role}/edit')
                ->uses('UpdateController@edit')
                ->name('edit');

            Route::put('{role}/update')
                ->uses('UpdateController@update')
                ->name('update');

            Route::delete('{role}/delete')
                ->uses('DeleteController@delete')
                ->name('delete');
        });
});

Route::get('/me/update')
    ->uses('UpdateMeController@edit')
    ->name('update-me');

Route::post('/me/update-me')
    ->uses('UpdateMeController@update')
    ->name('update-me.store');

Route::post('/me/password')
    ->uses('UpdateMeController@changePassword')
    ->name('update-me.password');
