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
            ['musician male (8) modern.jpg', 8, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (8) modern 3.jpg', 8, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (8) modern 2.jpg', 8, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (7) modern.jpg', 7, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (7) modern 3.jpg', 7, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (7) modern 2.jpg', 7, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (6) modern 2.jpg', 6, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (6) classical.jpg', 6, [$genreIds['Classical']], 'male'],
            ['musician male (5) modern.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (5) modern 3.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (5) modern 2.jpg', 5, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (5) classical 2.jpg', 5, [$genreIds['Classical']], 'male'],
            ['musician male (3) modern.jpg', 3, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (2) classical 2.jpg', 2, [$genreIds['Classical']], 'male'],
            ['musician male (1) modern.jpg', 1, [$genreIds['Pop'], $genreIds['Rock']], 'male'],
            ['musician male (1) classical.jpg', 1, [$genreIds['Classical']], 'male'],
            ['musician female (6) modern.jpg', 6, [$genreIds['Pop'], $genreIds['Rock']], 'female'],
            ['musician female (5) classical.jpg', 5, [$genreIds['Classical']], 'female'],
            ['musician female (4) classical.jpg', 4, [$genreIds['Classical']], 'female'],
            ['musician female (3) classical.jpg', 3, [$genreIds['Classical']], 'female'],
            ['musician female (2) classical.jpg', 2, [$genreIds['Classical']], 'female']
        ];


        UserFactory::new()->venue()->count(4)->create();

        foreach ($usersInfo as $info) {
            UserFactory::new()->withPictureAndGenres($info[0], $info[1], $info[2])->withGender($info[3])->create();
        }
    }
}
