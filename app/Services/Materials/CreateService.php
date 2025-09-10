<?php

namespace App\Services\Materials;

use App\Models\Material;

class CreateService
{
    /**
     * @param array $payloads
     * @return Material
     */
    public function handle(array $payloads = []): Material
    {
        return Material::create($payloads);
    }
}
