<?php

namespace App\Services\Trainings;

use App\Models\Training;
use App\Models\UserTraining;

class StatisticsService
{
    /**
     * @param Training $model
     * @param array $payloads
     * @return Training
     */
    public function handle(Training $model, array $payloads = []): Training
    {
        $constraint = [
            'training_id' => $model->id,
            'user_id' => $payloads['user_id'],
        ];

        UserTraining::query()->updateOrCreate(
            $constraint,
            [
                ...$constraint,
                'spend_time' => $payloads['spend_time'] ?? null
            ]
        );

        return $model;
    }

    /**
     * @param Training $model
     * @param array $payloads
     * @return Training
     */
    public function handleView(Training $model, array $payloads = []): Training
    {
        $constraint = [
            'training_id' => $model->id,
            'user_id' => $payloads['user_id'],
        ];

        UserTraining::query()->updateOrCreate(
            $constraint,
            [
                ...$constraint,
                'updated_at' => now()
            ]
        );

        return $model;
    }

}
