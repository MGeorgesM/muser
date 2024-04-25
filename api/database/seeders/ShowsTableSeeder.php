<?php

namespace Database\Seeders;

use Database\Factories\ShowFactory;
use Illuminate\Database\Seeder;

class ShowsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ShowFactory::new()->count(10)->create();
    }
}
