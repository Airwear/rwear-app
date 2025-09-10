<?php

namespace App\Services\Categories;

use Illuminate\Database\Eloquent\Model;

class UpdateService
{
    /**
     * @param Model $model
     * @param array $payloads
     * @return Model
     */
    public function handle(Model $model, array $payloads = []): Model
    {
        $model->update($payloads);

        return $model;
    }
}
