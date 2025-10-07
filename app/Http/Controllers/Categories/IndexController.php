<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Category as Model;
use App\Repositories\CategoryRepository as Repository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    protected string $baseView = 'categories';

    protected string $baseRoute = 'categories';

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
