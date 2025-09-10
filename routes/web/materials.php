<?php

use App\Http\Controllers\Materials\IndexController;
use Illuminate\Support\Facades\Route;

Route::get('/', [IndexController::class, 'index'])->name('list');

