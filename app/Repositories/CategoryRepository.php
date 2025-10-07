<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryRepository extends AbstractRepository
{
    protected function model(): void
    {
        $this->model = new Category();
    }

    public function getList(Request $request, int $perPage = null): Collection | LengthAwarePaginator
    {
        return $this
            ->model
            ->newQuery()
            ->orderBy('order')
            ->orderBy('designation')
            ->paginate(20)
            //->get()
            ;
    }

    public function forApi(Request $request)
    {
        return $this
            ->model
            ->newQuery()
            ->withCount('trainings')
            ->orderBy('order')
            ->whereHas('trainings', function ($query) {
                $query->whereNotNull('url');
            })
            ->get();
    }
}
