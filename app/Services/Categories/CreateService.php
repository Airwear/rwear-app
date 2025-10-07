<?php

namespace App\Services\Categories;

use App\Models\Category;

class CreateService
{
    /**
     * @param array $payloads
     * @return Category
     */
    public function handle(array $payloads = []): Category
    {
        return Category::create($payloads);
    }
}
