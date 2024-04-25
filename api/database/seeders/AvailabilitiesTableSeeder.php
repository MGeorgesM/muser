<?php

namespace Database\Seeders;

use App\Models\Availability;
use Illuminate\Database\Seeder;

class AvailabilitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Availability::trunicate();
        
        Availability::create(['name' => 'Mornings']);
        Availability::create(['name' => 'Afternoons']);
        Availability::create(['name' => 'Evenings']);
        Availability::create(['name' => 'Nights']);
    }
}
