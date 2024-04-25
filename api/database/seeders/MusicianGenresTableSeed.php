<?php

namespace Database\Seeders;

use Database\Factories\MusicianGenreFactory;
use Illuminate\Database\Seeder;

class MusicianGenresTableSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MusicianGenreFactory::new()->count(20)->create();
    }
}
