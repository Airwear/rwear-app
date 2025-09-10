<?php

Route::get('/dashboard')
    ->uses('DashboardController@index')
    ->name('dashboard');

Route::prefix('medias')
    ->name('medias.')
    ->group(__DIR__ . '/medias.php');


Route::prefix('users-access')
    ->name('users.')
    ->namespace('Users')
    ->group(__DIR__ . '/users.php');

Route::prefix('groups')
    ->name('groups.')
    ->namespace('Groups')
    ->group(__DIR__ . '/groups.php');

Route::prefix('articles')
    ->name('articles.')
    ->namespace('Articles')
    ->group(__DIR__ . '/articles.php');

Route::prefix('coaches')
    ->name('coaches.')
    ->group(__DIR__ . '/coaches.php');

Route::prefix('categories')
    ->name('categories.')
    ->group(__DIR__.'/categories.php');

Route::prefix('materials')
    ->name('materials.')
    ->group(__DIR__.'/materials.php');

Route::prefix('trainings')
    ->name('trainings.')
    ->group(__DIR__.'/trainings.php');
