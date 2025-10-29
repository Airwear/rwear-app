<?php

Route::get('{mediaId}/download')
    ->uses('MediasController@download')
    ->name('download');

Route::get('{mediaId}/show')
    ->uses('MediasController@show')
    ->name('show');

Route::get('{mediaId}/viewer')
    ->uses('MediasController@viewer')
    ->name('viewer');

Route::delete('{mediaId}/delete')
    ->uses('MediasController@delete')
    ->name('delete');

Route::delete('{mediaId}/deleteAjax')
    ->uses('MediasController@deleteAjax')
    ->name('deleteAjax');
