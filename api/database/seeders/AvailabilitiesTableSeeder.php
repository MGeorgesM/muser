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
        $availability->name = 'mornings';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'afternoons';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'evenings';
        $availability->save();

        $availability = new Availability();
        $availability->name = 'nights';
        $availability->save();
    }
}
