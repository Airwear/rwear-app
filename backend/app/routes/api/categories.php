<?php

use App\Http\Controllers\Api\Categories\ResourceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ResourceController::class, 'index'])->name('list');
Route::get('{slug}', [ResourceController::class, 'show'])->name('show');
Route::post('store', [ResourceController::class, 'store'])->name('store');
Route::post('{slug}', [ResourceController::class, 'update'])->name('update');
Route::post('{slug}/destroy', [ResourceController::class, 'destroy'])->name('destroy');

// copy to the route file and remove comments
/*Route::prefix('categories')
    ->name('categories.')
    ->group(__DIR__.'/api/categories.php')
;*/
