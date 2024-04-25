<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instrument;

class InstrumentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $intrument = new Instrument();
        $intrument->name = 'strings';
        $intrument->save();

        $intrument = new Instrument();
        $intrument->name = 'brass';
        $intrument->save();

        $intrument = new Instrument();
        $intrument->name = 'bass';
        $intrument->save();

        $intrument = new Instrument();
        $intrument->name = 'percussion';
        $intrument->save();

        $intrument = new Instrument();
        $intrument->name = 'keyboard';
        $intrument->save();

        $intrument = new Instrument();
        $intrument->name = 'vocal';
        $intrument->save();
    }
}
