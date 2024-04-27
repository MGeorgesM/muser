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
        $availability = new Availability();
        $availability->name = 'Mornings';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'Afternoons';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'Evenings';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'Nights';
        $availability->save();
    }
}
