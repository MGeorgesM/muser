<?php

namespace Database\Seeders;

use Database\Factories\BandFactory;
use Illuminate\Database\Seeder;

class BandsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BandFactory::new()->count(20)->create();
    }
}
