<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesTableSeeder::class);
        $this->call(GenresTableSeeder::class);
        $this->call(AvailabilitiesTableSeeder::class);
        $this->call(ExperiencesTableSeeder::class);
        $this->call(InstrumentsTableSeeder::class);
        $this->call(VenueTypesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(BandsTableSeeder::class);
        $this->call(BandMembersTableSeeder::class);
        $this->call(ShowsTableSeeder::class);
        $this->call(MusicianGenresTableSeed::class);
        $this->call(VenuesRatingsTableSeeder::class);
    }
}
