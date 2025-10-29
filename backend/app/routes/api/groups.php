<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Groups\ResourceController;

Route::get('/', [ResourceController::class, 'index'])->name('index');
Route::get('/{slug}', [ResourceController::class, 'show'])->name('show');
Route::put('/{slug}', [ResourceController::class, 'update'])->name('update');

