<?php

use App\Models\Group;
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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('slug')->unique();
            $table->string('social_reason')->nullable();
            $table->string('siret')->nullable();
            $table->string('siren')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('city')->nullable();
            $table->boolean('accept_click_on_collect')->nullable();
            $table->boolean('accept_payment_on_line')->nullable();
            $table->boolean('active')->nullable();
            $table->string('contact_name')->nullable();
            $table->longText('description')->nullable();
            $table->string('web_site_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->timestamps();
        });

        Group::create([
            'designation' => 'Optikar Group',
            'email' => 'contact@optikar.org',
            'contact_name' => 'Mya',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groups');
    }
};
