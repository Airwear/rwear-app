<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ListController;
use App\Http\Controllers\Api\Auth\UpdateController;

Route::post('login', [LoginController::class, 'login'])->name('login');
Route::post('register', [RegisterController::class, 'register'])->name('register');

Route::get('/', [ListController::class, 'index'])->name('index');
Route::get('/{user}', [ListController::class, 'show'])->name('show');
Route::put('/{user}', [UpdateController::class, 'update'])->name('update');

