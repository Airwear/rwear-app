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
        Schema::table('user_trainings', function (Blueprint $table) {
            $table->smallInteger('view_count')->nullable()->after('spend_time');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_trainings', function (Blueprint $table) {
            $table->dropColumn('view_count');
        });
    }
};
