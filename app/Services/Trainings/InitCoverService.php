<?php

namespace App\Services\Trainings;

use App\Models\Training;

class InitCoverService
{
    public function initEmptyCover(): void
    {
        echo "Start: initEmptyCover \n";

        Training::query()
            ->whereNotNull('url')
            ->whereNull('cover')
            ->get()
            ->each(function ($model) {
                $model->update([
                    'cover' => str_replace('.mp4', '.jpeg', $model->url)
                ]);
            });

        echo "End: initEmptyCover \n";
    }
}
