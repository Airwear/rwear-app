<?php

namespace App\Repositories;

use App\Models\Training;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class TrainingRepository extends AbstractRepository
{
    protected function model(): void
    {
        $this->model = new Training();
    }

    public function getList(Request $request, int $perPage = null): Collection | LengthAwarePaginator
    {
        $search = $request->get('searched');
        $categoryId = $request->get('category_id');
        return $this
            ->model
            ->newQuery()
            ->when(! empty($search), function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('designation', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%')
                    ;
                })
                ->orWhereHas('category', function ($query) use ($search) {
                    $query->where('designation', 'like', '%'.$search.'%');
                });
            })
            ->when(! empty($categoryId), function ($query) use ($categoryId) {
                $query->where(function ($query) use ($categoryId) {
                    $query->where('category_id', $categoryId);
                });
            })
            ->with(['coach', 'category', 'level'])
            ->orderByRaw('LENGTH(url) DESC')
            ->orderByDesc('updated_at')
            ->orderBy('designation')
            ->paginate(20)
            //->get()
            ;
    }

    public function forApi(Request $request): Collection|array
    {
        $categoryId = $request->get('category_id');
        return $this
            ->model
            ->newQuery()
            ->where('category_id', $categoryId)
            ->whereNotNull('url')
            ->orderBy('designation')
            ->get();
    }
}
