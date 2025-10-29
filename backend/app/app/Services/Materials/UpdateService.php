<?php

namespace App\Services\Materials;

use App\Models\Material;


class UpdateService
{
    /**
     * @param Material $model
     * @param array $payloads
     * @return Material
     */
    public function handle(Material $model, array $payloads = []): Material
    {
        $model->update($payloads);

        return $model;
    }
}
