<?php

namespace App\Repositories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class ArticleRepository extends AbstractRepository
{

    protected function model(): void
    {
        $this->model = new Article();
    }

    /**
     * @param Request $request
     * @param int|null $perPage
     * @return Collection
     */
    public function getList(Request $request, int $perPage = null): Collection
    {
        $searched = $request->get('searched');

        return $this
            ->model
            ->newQuery()
            ->with('unit')
            ->orderBy('designation')
            ->when(! empty($searched), function ($query) use ($searched) {
                $query->where('designation', 'like', '%'.$searched.'%');
            })
            ->group()
            ->get()
        ;
    }
}
