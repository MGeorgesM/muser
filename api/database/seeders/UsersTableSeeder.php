<?php

namespace Database\Seeders;

use App\Models\Genre;
use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Factories\UserFactory;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch genre IDs based on names
        $genreIds = Genre::whereIn('name', ['Pop', 'Rock', 'Classical'])->get()->pluck('id', 'name');

        $usersInfo = [
            ['musician (6) modern.jpg', 6, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (6) modern 2.jpg', 6, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (6) classical.jpg', 6, [$genreIds['Classical']]],
            ['musician (5) modern.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (5) modern 3.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (5) modern 2.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (5) classical.jpg', 5, [$genreIds['Classical']]],
            ['musician (5) classical 2.jpg', 5, [$genreIds['Classical']]],
            ['musician (4) modern.jpg', 4, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (4) modern 3.jpg', 4, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (4) modern 2.jpg', 4, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (3) modern.jpg', 3, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (3) classical.jpg', 3, [$genreIds['Classical']]],
            ['musician (2) modern.jpg', 2, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (2) modern 3.jpg', 2, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (2) modern 2.jpg', 2, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (2) classical.jpg', 2, [$genreIds['Classical']]],
            ['musician (2) classical 2.jpg', 2, [$genreIds['Classical']]],
            ['musician (1) modern.jpg', 1, [$genreIds['Pop'], $genreIds['Rock']]],
            ['musician (1) classical.jpg', 1, [$genreIds['Classical']]]
        ];

        UserFactory::new()->venue()->count(4)->create();

        foreach ($usersInfo as $info) {
            UserFactory::new()->withPictureAndGenres($info[0], $info[1], $info[2])->create();
        }
    }
}
