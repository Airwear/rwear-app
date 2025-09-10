<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

abstract class AbstractRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->model();
    }

    /**
     * @return void
     */
    protected abstract function model(): void;

    public function getList(Request $request, int $perPage = null): Collection | LengthAwarePaginator
    {
        return $this
            ->model
            ->newQuery()
            ->orderBy('designation')
            //->orderByDesc('updated_at')
            ->paginate(20)
            //->get()
        ;
    }

    public function findBySlug(string $slug)
    {
        return $this->model->newQuery()->where('slug', $slug)->first();
    }

    public function findById(string $id): ?Model
    {
        return $this->model->newQuery()->where('id', $id)->first();
    }

    public function count(): ?int
    {
        return $this->model->newQuery()->count();
    }

    public function forApi(Request $request)
    {
        return $this->model->newQuery()->get();
    }
}
