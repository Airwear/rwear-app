<?php

namespace App\Http\Controllers\Trainings;

use App\Http\Controllers\Controller;
use App\Models\Training as Model;
use Illuminate\Contracts\View\View;

class ShowController extends Controller
{
    protected string $baseView = 'trainings';

    protected string $baseRoute = 'trainings';

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
