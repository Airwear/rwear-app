<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        User::query()->get()->each(fn ($model) => $model->update(['last_connection' => $model->created_at]));
    }

};
