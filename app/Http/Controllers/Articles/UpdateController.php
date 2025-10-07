<?php

namespace App\Http\Controllers\Articles;

use App\Http\Controllers\Controller;

use App\Http\Requests\Articles\UpdateRequest;
use App\Models\Article;
use App\Services\Articles\UpdateService;
use Illuminate\Http\RedirectResponse;

class UpdateController extends Controller
{
    /**
     * @param Article $article
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Article $article)
    {
        return view('articles.edit', [
            'article' => $article,
        ]);
    }

    /**
     * @param UpdateRequest $request
     * @param UpdateService $service
     * @param Article $article
     * @return RedirectResponse
     */
    public function update(UpdateRequest $request, UpdateService $service, Article $article): RedirectResponse
    {
        try {

            $service->handle(article: $article,request: $request);

            return back()->with('success', trans('auth.updated'));

        } catch (\Throwable $e) {

            $this->log($e, $request->all());

            return back()->with('error', trans('navigation.exception_message'));
        }
    }
}
