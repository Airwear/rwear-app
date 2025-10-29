<?php

namespace App\Http\Controllers\Api\Coaches;

use App\DataTransformers\CoachDataTransformer as Transformer;
use App\Http\Controllers\Api\BaseApiController as BaseController;
use App\Http\Requests\Api\Coaches\StoreRequest;
use App\Http\Requests\Api\Coaches\UpdateRequest;
use App\Models\Coach as Model;
use App\Repositories\CoachRepository as Repository;
use App\Services\Coaches\CreateService;
use App\Services\Coaches\UpdateService;
use App\Services\Coaches\DeleteService;
use Illuminate\Http\Request;

class ResourceController extends BaseController
{
    public function __construct(
        protected Transformer $dataTransformer,
        protected Repository $repository,
    )
    {}

    /**
     * @param Request $request
     * @return array
     */
    public function index(Request $request): array
    {
        try {

            return $this->toApi(
                $this->dataTransformer->transform(data: $this->repository->getList($request))
            );

        } catch (\Throwable $e) {
            return $this->failException($e);
        }
    }


    /**
     * @param StoreRequest $request
     * @param CreateService $service
     * @return array
     */
    public function store(StoreRequest $request, CreateService $service): array
    {
        try {

            return $this->toApi(
                $this->dataTransformer->transform(data: $service->handle($request->validated()))
            );

        } catch (\Throwable $e) {
            return $this->failException($e);
        }
    }


    /**
     * @param UpdateRequest $request
     * @param UpdateService $service
     * @param string $slug
     * @return array
     */
    public function update(UpdateRequest $request, UpdateService $service, string $slug): array
    {
        try {

            $model = $this->repository->findBySlug($slug);

            if (! $model) {
                throw new \LogicException(trans('errors.model_not_found'));
            }

            return $this->toApi(
                $this->dataTransformer->transform(data: $service->handle($model, $request->validated()))
            );

        } catch (\Throwable $e) {
            return $this->failException($e);
        }
    }

    /**
     * @param string $slug
     * @return array
     */
    public function show(string $slug): array
    {
        try {

            $model = $this->repository->findBySlug($slug);

            if (! $model) {
                throw new \LogicException(trans('errors.model_not_found'));
            }

            return $this->toApi(
                $this->dataTransformer->transform(data: $model)
            );

        } catch (\Throwable $e) {
            return $this->failException($e);
        }
    }

    /**
     * @param DeleteService $service
     * @param string $slug
     * @return array
     */
    public function destroy(DeleteService $service, string $slug): array
    {
        try {

            $model = $this->repository->findBySlug($slug);

            if (! $model) {
                throw new \LogicException(trans('errors.model_not_found'));
            }

            $service->handle($model);

            return $this->toApi([]);

        } catch (\Throwable $e) {
            return $this->failException($e);
        }
    }
}
