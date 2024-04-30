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
        $maxMembers = 6;

        foreach ($bands as $band) {
            $usedUserIds = [];
            $numberOfMembers = rand(2, $maxMembers);

            for ($i = 0; $i < $numberOfMembers; $i++) {
                $userId = User::whereNotIn('id', $usedUserIds)->inRandomOrder()->first()->id;

                BandMember::factory()->forBand($band->id)->forUser($userId)->create();
                $usedUserIds[] = $userId;

                if ($i >= 1 && rand(0, 1)) {
                    break;
                }
            }
        }
    }
}
