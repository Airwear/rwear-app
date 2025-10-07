<?php

namespace App\Services\Trainings;

use App\Models\Training;

class CreateService
{
    /**
     * @param array $payloads
     * @return Training
     */
    public function handle(array $payloads = []): Training
    {
        return Training::create($payloads);
    }
}
