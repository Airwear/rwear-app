<?php

namespace App\Services\Coaches;

use App\Models\Coach;

class CreateService
{
    /**
     * @param array $payloads
     * @return Coach
     */
    public function handle(array $payloads = []): Coach
    {
        return Coach::create($payloads);
    }
}
