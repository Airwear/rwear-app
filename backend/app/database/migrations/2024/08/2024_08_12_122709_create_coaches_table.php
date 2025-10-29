<?php

use App\Models\Coach;
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
        Schema::create('coaches', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('designation');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('color')->nullable();
            $table->timestamps();
        });

        Coach::create([
            'designation' => 'Coach Herman',
            'color' => '#e0d7d7',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coaches');
    }
};
