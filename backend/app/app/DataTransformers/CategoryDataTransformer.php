<?php

namespace App\DataTransformers;


use App\Models\Category;
use Illuminate\Support\Collection;

class CategoryDataTransformer extends AbstractDataTransformer
{
    public function transform($data): array
    {

        if ($data instanceof Collection) {
            return $data->map(fn(Category $model) => $model->toApi())->toArray();
        }

        if ($data instanceof Category) {
            return $data->toApi();
        }

        return [];
    }
}
