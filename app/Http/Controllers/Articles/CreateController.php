<?php

namespace App\Http\Controllers\Articles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Articles\StoreRequest;
use App\Models\Article as Model;
use Illuminate\Http\RedirectResponse;

class CreateController extends Controller
{
    /**
     * @param StoreRequest $request
     * @return RedirectResponse
     */
    public function store(StoreRequest $request): RedirectResponse
    {
        try {

            $model = Model::create($request->validated());

            return redirect()
                ->route('articles.edit', [$model])
                ->with('success', "Article crée avec succès. Veuillez complétez ses informations.");

        } catch (\Throwable $e) {

            $this->log($e, $request->all());

            return back()->with('error', trans('navigation.exception_error'));
        }
    }
}
