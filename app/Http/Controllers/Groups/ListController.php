<?php

namespace App\Http\Controllers\Groups;

use App\Http\Controllers\Controller;
use App\Repositories\GroupRepository;
use Illuminate\Http\Request;

class ListController extends Controller
{
    /**
     * @param Request $request
     * @param GroupRepository $repository
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index(Request $request, GroupRepository $repository)
    {
        if (! $request->user()->is_super_admin) {
            return redirect()->route('groups.edit', [$request->user()->group]);
        }

        return view('groups.list', [
            'list' => $repository->getList($request),
            'searched' => $request->get('searched'),
        ]);
    }
}
