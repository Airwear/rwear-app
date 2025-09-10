<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \App\Models\Training::query()->whereNotNull('url')->get()->each(function ($model) {
            $model->update([
                'cover' => str_replace('.mp4', '.jpeg', $model->url)
            ]);
        });
    }
};
