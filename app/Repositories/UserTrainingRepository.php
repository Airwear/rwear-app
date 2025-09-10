<?php

namespace App\Repositories;

use App\Models\UserTraining;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class UserTrainingRepository extends AbstractRepository
{
    protected function model(): void
    {
        $this->model = new UserTraining();
    }

    public function getList(Request $request, int $perPage = null): LengthAwarePaginator|Collection
    {
        return $this
            ->model
            ->newQuery()
            ->orderByDesc('updated_at')
            ->paginate($perPage)
            //->get()
            ;
    }
}
