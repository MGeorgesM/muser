<?php

namespace Database\Seeders;

use App\Models\VenueType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VenueTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $venue_type = new VenueType();
        $venue_type->name = 'Pub';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'Club';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'Hotel';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'Restaurant';
        $venue_type->save();
    }
}
