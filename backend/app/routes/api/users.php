<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ListController;
use App\Http\Controllers\Api\Auth\UpdateController;

use App\Http\Controllers\Api\Auth\VerifyEmailController;

Route::post('login', [LoginController::class, 'login'])->name('login');
Route::post('register', [RegisterController::class, 'register'])->name('register');

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [VerifyEmailController::class, 'me'])->name('me');
    Route::post('/resend-verification', [VerifyEmailController::class, 'resend'])->name('resend-verification');
});

Route::get('/', [ListController::class, 'index'])->name('index');
Route::get('/{user}', [ListController::class, 'show'])->name('show');
Route::put('/{user}', [UpdateController::class, 'update'])->name('update');

