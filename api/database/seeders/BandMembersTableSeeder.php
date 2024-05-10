<?php

namespace Database\Seeders;

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
        $maxMembers = 3;

        foreach ($bands as $band) {
            $usedUserIds = [];
            $numberOfMembers = rand(2, $maxMembers);

            for ($i = 0; $i < $numberOfMembers; $i++) {
                $userId = User::where('role_id', 1)->whereNotIn('id', $usedUserIds)->inRandomOrder()->first()->id;

                BandMember::factory()->forBand($band->id)->forUser($userId)->create();
                $usedUserIds[] = $userId;

                if ($i >= 1 && rand(0, 1)) {
                    break;
                }
            }
        }
    }
}
