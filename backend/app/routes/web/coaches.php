<?php

use App\Http\Controllers\Coaches\IndexController;
use App\Http\Controllers\Coaches\UpdateController;
use App\Http\Controllers\Coaches\ShowController;
use Illuminate\Support\Facades\Route;

Route::get('/', [IndexController::class, 'index'])->name('list');
Route::get('/{coach}', [UpdateController::class, 'edit'])->name('edit');
Route::get('/{coach}/show', [ShowController::class, 'show'])->name('show');

// copy this routes/web/
/*Route::prefix('coaches')
    ->name('coaches.')
    ->middleware(['auth'])
    ->group(__DIR__.'/web/coaches.php')
;*/
