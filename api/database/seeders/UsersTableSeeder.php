<?php

namespace Database\Seeders;

use Database\Factories\UserFactory;
use Database\Factories\VenueFactory;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserFactory::new()->count(10)->create();
        VenueFactory::new()->count(5)->create();
    }
}
