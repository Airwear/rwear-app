<?php

namespace App\Http\Controllers;

use App\Http\Requests\Resources\StoreRequest;
use App\Http\Requests\Resources\UpdateRequest;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * @param Request $request
     * @param string $resourceName
     * @return View
     */
    public function index(Request $request, string $resourceName): View
    {
        return view("resources.list", [
            'list' => collect(),
            'model' => null,
            'modelName' => $resourceName,
        ]);
    }


    /**
     * @param StoreRequest $request
     * @param string $modelName
     * @return array|RedirectResponse
     */
    public function store(StoreRequest $request, string $modelName): array|RedirectResponse
    {
        try {

            $model = $this->resourceModel($modelName);

            session()->flash('success', trans('resources.created'));

            return [
                'success' => true,
                'model' => $model->service()->create($request->validated()),
            ];

        } catch (\Throwable $e) {
            return $this->throwException($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $modelName, string $slug)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $modelName, string $slug)
    {
        //
    }

    /**
     * @param UpdateRequest $request
     * @param string $modelName
     * @param string $slug
     * @return array|RedirectResponse
     */
    public function update(UpdateRequest $request, string $modelName, string $slug): array|RedirectResponse
    {
        try {

            $model = $this
                ->resourceModel($modelName)
                ->repository()
                ->findBySlug($slug)
            ;

            session()->flash('success', trans('resources.updated'));

            return [
                'success' => $model->service()->update($request->validated())
            ];

        } catch (\Throwable $e) {
            return $this->throwException($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $modelName, string $slug)
    {
        //
    }
}
