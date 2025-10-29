<?php

namespace App\Http\Controllers\Articles;

use App\Http\Controllers\Controller;
use App\Repositories\ArticleRepository;
use Illuminate\Http\Request;

class ListController extends Controller
{
    /**
     * @param Request $request
     * @param ArticleRepository $repository
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index(Request $request, ArticleRepository $repository)
    {
        return view('articles.list', [
            'list' => $repository->getList($request),
            'searched' => $request->get('searched'),
        ]);
    }
}
