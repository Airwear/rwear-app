<?php

namespace App\Http\Controllers\Coaches;

use App\Http\Controllers\Controller;
use App\Models\Coach as Model;
use Illuminate\Contracts\View\View;

class ShowController extends Controller
{
    protected string $baseView = 'coaches';

    protected string $baseRoute = 'coaches';

    /**
     * @param Model $model
     * @return View
     */
    public function show(Model $model): View
    {
        return view("{$this->baseView}.show",  [
            'baseRoute' => $this->baseRoute,
            'baseView' => $this->baseView,
            'model' => $model,
        ]);
    }
}
