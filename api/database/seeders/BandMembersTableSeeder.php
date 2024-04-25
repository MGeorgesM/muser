<?php

namespace Database\Seeders;

use Database\Factories\BandMemberFactory;
use Illuminate\Database\Seeder;

class BandMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BandMemberFactory::new()->count(20)->create();
    }
}
