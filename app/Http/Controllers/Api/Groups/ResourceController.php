<?php

namespace App\Http\Controllers\Api\Groups;


use App\Models\Group;
use App\DataTransformers\GroupTransformer as DataTransformer;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Groups\UpdateRequest;
use App\Repositories\GroupRepository as Repository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function __construct(
        protected DataTransformer $dataTransform,
        protected Repository $repository,
    )
    {}

    /**
     * @param Request $request
     * @return array|JsonResponse
     */
    public function index(Request $request): JsonResponse|array
    {
        try {

            return response()->json(
                $this->success(
                    action: 'list',
                    data: $this->dataTransform->toCollection(collection: $this->repository->getList($request))
                )
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }


    /**
     * @param UpdateRequest $request
     * @param string $slug
     * @return array|JsonResponse
     */
    public function update(UpdateRequest $request, string $slug): JsonResponse
    {
        try {

            $model = $this->repository->findBySlug($slug);

            if (! ($model instanceof Group)) {
                throw new \LogicException(trans('errors.not_found'));
            }

            $model->update($request->validated());

            return response()->json(
                $this->success(
                    action: 'update',
                    data: $this->dataTransform->transform(group: $model)
                )
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        try {

            $model = $this->repository->findBySlug($slug);

            if (! ($model instanceof Group)) {
                throw new \LogicException(trans('errors.not_found'));
            }

            return response()->json(
                $this->success(
                    action: 'show',
                    data: $this->dataTransform->transform(group: $model)
                )
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
