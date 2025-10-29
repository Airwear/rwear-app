<?php

namespace App\Http\Controllers\Materials;

use App\Http\Controllers\Controller;
use App\Models\Material as Model;
use App\Repositories\MaterialRepository as Repository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    protected string $baseView = 'materials';

    protected string $baseRoute = 'materials';

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
