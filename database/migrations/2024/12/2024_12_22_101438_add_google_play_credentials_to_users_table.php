<?php

use App\Models\User;
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
        User::query()->updateOrCreate(
            ['email' => 'access@rwear-sport.com',],
            [
                'email' => 'access@rwear-sport.com',
                'password' => bcrypt('adM1n@4App'),
            ]
        );
    }
};
