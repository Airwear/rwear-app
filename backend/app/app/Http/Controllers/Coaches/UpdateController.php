<?php

namespace App\Http\Controllers\Coaches;

use App\Http\Controllers\Controller;
use App\Models\Coach as Model;
use Illuminate\Contracts\View\View;

class UpdateController extends Controller
{
    protected string $baseView = 'coaches';

    protected string $baseRoute = 'coaches';

    /**
     * @param Model $model
     * @return View
     */
    public function edit(Model $model): View
    {
        return view("{$this->baseView}.edit",  [
            'baseRoute' => $this->baseRoute,
            'baseView' => $this->baseView,
            'model' => $model,
        ]);
    }
}
