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
        $experience->name = 'beginner';
        $experience->save();

        $experience = new Experience();
        $experience->name = 'intermediate';
        $experience->save();

        $experience = new Experience();
        $experience->name = 'virtuoso';
        $experience->save();
    }
}
