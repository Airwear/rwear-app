<?php

namespace App\Services\Trainings;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateService
{
    protected ?UploadedFile $file;

    /**
     * @param UploadedFile $file
     * @return $this
     */
    public function setFile(?UploadedFile $file): self
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @param Model $model
     * @param array $payloads
     * @return Model
     */
    public function handle(Model $model, array $payloads = []): Model
    {

        DB::transaction(function () use ($model, $payloads) {

            $data = [
                ...$payloads,
            ];

            if (empty($model->cover) && $model->url) {
                //$data['cover'] = str_replace('.mp4', '.jpeg', $model->url);
            }

            $model->update($data);

            $model->materials()->sync($payloads['material_id'] ?? []);

            $this->updateMedias($model);

        });


        return $model;
    }

    /**
     * @param Model $model
     * @return void
     */
    public function updateMedias(Model $model): void
    {
        $uploadedFile = $this->file;
        if ($uploadedFile?->isValid()) {
            $model
                ->addMediaFromRequest("file")
                ->toMediaCollection($model->getTable(), $model->getTable());
        }
    }
}
