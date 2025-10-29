<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Categories\IndexController;

Route::get('/', [IndexController::class, 'index'])->name('list');

