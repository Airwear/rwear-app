<?php

namespace App\Repositories;

use App\Models\Material;

class MaterialRepository extends AbstractRepository
{
    protected function model(): void
    {
        $this->model = new Material();
    }
}
