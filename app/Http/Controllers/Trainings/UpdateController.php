<?php

namespace App\Http\Controllers\Trainings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Trainings\UpdateRequest;
use App\Models\Category;
use App\Models\Coach;
use App\Models\Material;
use App\Models\Training as Model;
use App\Models\TrainingLevel;
use App\Services\Trainings\UpdateService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class UpdateController extends Controller
{
    protected string $baseView = 'trainings';

    protected string $baseRoute = 'trainings';

    /**
     * @param Model $training
     * @return View
     */
    public function edit(Model $training): View
    {
        $coaches = Coach::query()
            ->orderBy('designation')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->designation,
                ];
            })
            ->prepend(['id' => '', 'label' => '']);

        $categories = Category::query()
            ->orderBy('designation')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->designation,
                ];
            })
            ->prepend(['id' => '', 'label' => '']);

        $materials = Material::query()
            ->orderBy('designation')
            ->pluck('designation', 'id')
            ->prepend('', null);

        $levels = TrainingLevel::query()
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->designation,
                ];
            })
            ->prepend(['id' => '', 'label' => '']);;

        return view("{$this->baseView}.edit",  [
            'baseRoute' => $this->baseRoute,
            'baseView' => $this->baseView,
            'model' => $training,
            'coaches' => $coaches,
            'materials' => $materials,
            'categories' => $categories,
            'levels' => $levels,
        ]);
    }

    /**
     * @param Model $training
     * @param UpdateRequest $request
     * @param UpdateService $service
     * @return RedirectResponse
     */
    public function update(Model $training, UpdateRequest $request, UpdateService $service): RedirectResponse
    {
        try {

            $service
                ->setFile(file: $request->file('file'))
                ->handle(model: $training, payloads: $request->validated());

            return back()->with('success', trans('navigation.updated'));
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
