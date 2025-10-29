<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::name('api.')
    ->group(function () {

        Route::prefix('users')
            ->name('users.')
            ->group(__DIR__ . '/api/users.php');

        Route::prefix('groups')
            ->name('groups.')
            ->group(__DIR__ . '/api/groups.php');

        Route::prefix('articles')
            ->name('articles.')
            ->group(__DIR__ . '/api/articles.php');

        Route::prefix('coaches')
            ->name('coaches.')
            ->group(__DIR__ . '/api/coaches.php');

        Route::prefix('categories')
            ->name('categories.')
            ->group(__DIR__.'/api/categories.php');

        Route::prefix('materials')
            ->name('materials.')
            ->group(__DIR__.'/api/materials.php');

        Route::prefix('trainings')
            ->name('trainings.')
            ->group(__DIR__.'/api/trainings.php');
    });
