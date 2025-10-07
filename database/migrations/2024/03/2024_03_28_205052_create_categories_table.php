<?php

use App\Models\Category;
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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('slug')->unique();
            $table->string('color')->nullable();
            $table->string('code')->nullable()->unique();
            $table->boolean('active')->nullable()->default(true);
            $table->integer('order')->nullable();
            $table->timestamps();
        });

        Category::create([
            'designation' => 'Yoga',
            'code' => 'yoga',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
