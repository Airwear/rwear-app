<?php

namespace App\DataTransformers;


use App\Models\Training;
use Illuminate\Database\Eloquent\Collection;

class TrainingDataTransformer extends AbstractDataTransformer
{
    public function transform($data): array
    {

        if ($data instanceof Collection) {
            return $data->map(fn(Training $training) => $training->toApi())->toArray();
        }

        if ($data instanceof Training) {
            return $data->toApi();
        }

        return [];
    }
}
