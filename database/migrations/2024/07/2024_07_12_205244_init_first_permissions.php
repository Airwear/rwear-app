<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Permission::create([
            'name' => 'manage users',
            'description' => 'Gérer (créer, modifier, supprimer) les comptes utilisateurs',
        ]);

        Permission::create([
            'name' => 'manage parameters',
            'description' => 'Gérer les paramètres du logiciel',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Permission::where('name', 'manage users')->delete();
        Permission::where('name', 'manage parameters')->delete();
    }
};
