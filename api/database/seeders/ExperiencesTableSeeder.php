<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperiencesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $experience = new Experience();
        $experience->name = 'Beginner';
        $experience->save();

        $experience = new Experience();
        $experience->name = 'Intermediate';
        $experience->save();

        $experience = new Experience();
        $experience->name = 'Virtuoso';
        $experience->save();
    }
}
