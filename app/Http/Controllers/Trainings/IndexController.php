<?php

namespace App\Http\Controllers\Trainings;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Training as Model;
use App\Repositories\TrainingRepository as Repository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    protected string $baseView = 'trainings';

    protected string $baseRoute = 'trainings';

    /**
     * @param Request $request
     * @param Repository $repository
     * @return View
     */
    public function index(Request $request, Repository $repository): View
    {
        return view("{$this->baseView}.list",  [
            'list' => $repository->getList($request),
            'baseRoute' => $this->baseRoute,
            'baseView' => $this->baseView,
            'categories' => Category::query()->orderBy('designation')->get()->pluck('designation', 'id')->prepend('', null),
            'model' => $this->intModel(),
        ]);
    }

    private function intModel(): Model
    {
        return new Model([
            'designation' => '',
            'group_id' => auth()->user()?->group_id
        ]);
    }
}
