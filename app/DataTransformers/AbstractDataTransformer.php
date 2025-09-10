<?php

namespace App\DataTransformers;

use App\Contracts\DataTransformerContract;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\C;

abstract class AbstractDataTransformer implements DataTransformerContract
{
    public function transform($data): array
    {

        if ($data instanceof Collection) {
            return $data->toArray();
        }

        if ($data instanceof Model) {
            return $data->toArray();
        }

        return [];
    }

}
