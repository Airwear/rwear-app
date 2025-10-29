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
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('designation');
            $table->string('url')->nullable();
            $table->text('description')->nullable();
            $table->string('duration_in_text')->nullable();
            $table->smallInteger('duration_in_minute')->nullable();
            $table->integer('order')->nullable();
            $table->foreignId('coach_id')->nullable()->constrained('coaches')->onDelete('SET NULL');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('SET NULL');
            $table->date('register_date')->nullable();
            $table->date('publish_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trainings');
    }
};
