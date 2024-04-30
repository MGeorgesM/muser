<?php

namespace Database\Seeders;

use Database\Factories\BandMemberFactory;
use Illuminate\Database\Seeder;
use App\Models\Band;
use App\Models\BandMember;
use App\Models\User;


class BandMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bands = Band::all();

        foreach ($bands as $band) {
            $usedUserIds = [];

            for ($i = 0; $i < 2; $i++) {
                $userId = User::whereNotIn('id', $usedUserIds)->inRandomOrder()->first()->id;
                BandMemberFactory::new()->forBand($band->id)->forUser($userId)->create();
                $usedUserIds[] = $userId;
            }
        }
    }
}
