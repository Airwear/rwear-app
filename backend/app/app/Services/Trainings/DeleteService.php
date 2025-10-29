<?php

namespace App\Services\Trainings;

use Illuminate\Database\Eloquent\Model;

class DeleteService
{
    /**
     * @param Model $model
     * @return void
     */
    public function handle(Model $model): void
    {
        $model->delete();
    }
}
