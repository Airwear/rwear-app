<?php

use App\Http\Controllers\Trainings\IndexController;
use App\Http\Controllers\Trainings\UpdateController;
use App\Http\Controllers\Trainings\ShowController;
use Illuminate\Support\Facades\Route;

Route::get('/', [IndexController::class, 'index'])->name('list');
Route::get('/{training}', [UpdateController::class, 'edit'])->name('edit');
Route::post('/{training}', [UpdateController::class, 'update'])->name('update');
Route::get('/{training}/show', [ShowController::class, 'show'])->name('show');

// copy this routes/web/
/*Route::prefix('trainings')
    ->name('trainings.')
    ->middleware(['auth'])
    ->group(__DIR__.'/web/trainings.php')
;*/
