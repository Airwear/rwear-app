<?php

use App\Http\Controllers\PolicyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get(config('glide.servers.trainings.base_url') . '/{path}', [
    'uses' => "App\\Http\\Controllers\\GlideController@trainings",
])->where('path', '(.*)');


Route::get('/')->uses("App\\Http\\Controllers\\HomeController")->name('home');

Route::get('policy', [PolicyController::class, '__invoke'])->name('policy');
Route::get('cgu', [PolicyController::class, '__invoke'])->name('cgu');

Route::middleware('auth')
    ->namespace("App\\Http\\Controllers")
    ->group(__DIR__ . '/web/index.php');
