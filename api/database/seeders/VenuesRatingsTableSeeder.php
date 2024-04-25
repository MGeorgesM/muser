<?php

namespace Database\Seeders;

use Database\Factories\VenuesRatingFactory;
use Illuminate\Database\Seeder;

class VenuesRatingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VenuesRatingFactory::new()->count(20)->create();
    }
}
