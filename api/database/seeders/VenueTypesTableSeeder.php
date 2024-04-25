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
        $venue_type->name = 'pub';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'club';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'hotel';
        $venue_type->save();

        $venue_type = new VenueType();
        $venue_type->name = 'restaurant';
        $venue_type->save();
    }
}
