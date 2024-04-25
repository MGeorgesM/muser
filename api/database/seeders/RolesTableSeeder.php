<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        $role = new Role();
        $role->name = 'musician';
        $role->save();

        $role = new Role();
        $role->name = 'venue';
        $role->save();

        $role = new Role();
        $role->name = 'admin';
        $role->save();
    }
}
