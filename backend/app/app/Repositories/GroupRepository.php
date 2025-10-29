<?php

namespace App\Repositories;

use App\Models\Group;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class GroupRepository extends AbstractRepository
{

    protected function model(): void
    {
        $this->model = new Group();
    }

    /**
     * @param Request $request
     * @param int|null $perPage
     * @return Collection
     */
    public function getList(Request $request, int $perPage = null): Collection
    {
        return $this
            ->model
            ->newQuery()
            ->orderBy('designation')
            ->orderByDesc('updated_at')
            ->get()
        ;
    }
}
