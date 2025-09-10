<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class UserRepository extends AbstractRepository
{

    protected function model(): void
    {
        $this->model = new User();
    }

    public function getList(Request $request, int $perPage = null): Collection | LengthAwarePaginator
    {
        return $this
            ->model
            ->newQuery()
            ->orderBy('username')
            ->where('id', '!=', auth()->id())
            ->when($text = $request->get('searched'), function ($queryBuilder) use ($text) {
                $queryBuilder->where(function ($queryBuilder) use ($text) {
                    $queryBuilder
                        ->orWhere('first_name', 'like', "%{$text}%")
                        ->orWhere('last_name', 'like', "%{$text}%")
                        ->orWhere('phone', 'like', "%{$text}%");
                });
            })
            ->group()
            ->paginate()
        ;
    }
}
