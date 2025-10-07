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
        User::create([
            'username' => 'letanou',
            'email' => 'noutathierry@yahoo.fr',
            'password' => bcrypt('admin@123'),
            'first_name' => 'Thierry',
            'last_name' => 'Nouta',
            'must_change_password' => false,
            'can_access_to_admin' => true,
            'is_super_admin' => true,
            'group_id' => 1,
        ]);

        User::create([
            'username' => 'herman',
            'email' => 'hermanfosso@yahoo.fr',
            'password' => bcrypt('herman@123'),
            'first_name' => 'Herman',
            'last_name' => 'Fosso',
            'must_change_password' => false,
            'can_access_to_admin' => true,
            'is_super_admin' => false,
            'group_id' => 1,
        ]);
    }
};
