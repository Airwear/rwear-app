<?php

use App\Models\TrainingLevel;
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
        Schema::create('training_levels', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('code')->unique();
            $table->smallInteger('order')->nullable();
            $table->timestamps();
        });

        TrainingLevel::create([
            'designation' => 'Débutant',
            'code' => 'beginner',
            'order' => 1,
        ]);

        TrainingLevel::create([
            'designation' => 'Intermédiaire',
            'code' => 'middle',
            'order' => 2,
        ]);

        TrainingLevel::create([
            'designation' => 'Confirmé',
            'code' => 'confirmed',
            'order' => 3,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_levels');
    }
};
