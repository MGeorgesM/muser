<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $location = new Location();
        $location->name = 'Beirut';
        $location->save();

        $location = new Location();
        $location->name = 'Jounieh';
        $location->save();

        $location = new Location();
        $location->name = 'Zahle';
        $location->save();

        $location = new Location();
        $location->name = 'Tripoli';
        $location->save();

        $location = new Location();
        $location->name = 'Saida';
        $location->save();

        $location = new Location();
        $location->name = 'Byblos';
        $location->save();

        $location = new Location();
        $location->name = 'Tyre';
        $location->save();

        $location = new Location();
        $location->name = 'Batroun';
        $location->save();

        $location = new Location();
        $location->name = 'Zgharta';
        $location->save();
    }
}
