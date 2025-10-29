<?php

namespace App\Repositories;

use App\Models\Coach;

class CoachRepository extends AbstractRepository
{
    protected function model(): void
    {
        $this->model = new Coach();
    }
}
