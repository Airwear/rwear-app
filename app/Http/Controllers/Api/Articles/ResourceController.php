<?php

namespace App\Http\Controllers\Api\Articles;


use App\Models\Group;
use App\DataTransformers\ArticleTransformer as DataTransformer;
use App\Http\Controllers\Controller;
use App\Repositories\ArticleRepository as Repository;
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
                    //data: $this->dataTransform->toCollection(collection: $this->repository->getList($request))
                    data: $this->dataTransform->fakers()
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
                //throw new \LogicException(trans('errors.not_found'));
            }

            return response()->json(
                $this->success(
                    action: 'show',
                    //data: $this->dataTransform->transform(model: $model)
                    data: $this->dataTransform->fakers()[rand(1, 13)]
                )
            );

        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
