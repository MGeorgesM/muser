<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;
use Database\Factories\UserFactory;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genrePopId = Genre::where('name', 'Pop')->first()->id;
        $genreRockId = Genre::where('name', 'Rock')->first()->id;
        $genreClassicalId = Genre::where('name', 'Classical')->first()->id;

        $pictures = [
            ['musician (6) modern.jpg', 6, ['Pop', 'Rock']],
            ['musician (6) modern 2.jpg', 6, ['Pop', 'Rock']],
            ['musician (6) classical.jpg', 6, ['Classical']],
            ['musician (5) modern.jpg', 5, ['Pop', 'Rock']],
            ['musician (5) modern 3.jpg', 5, ['Pop', 'Rock']],
            ['musician (5) modern 2.jpg', 5, ['Pop', 'Rock']],
            ['musician (5) classical.jpg', 5, ['Classical']],
            ['musician (5) classical 2.jpg', 5, ['Classical']],
            ['musician (4) modern.jpg', 4, ['Pop', 'Rock']],
            ['musician (4) modern 3.jpg', 4, ['Pop', 'Rock']],
            ['musician (4) modern 2.jpg', 4, ['Pop', 'Rock']],
            ['musician (3) modern.jpg', 3, ['Pop', 'Rock']],
            ['musician (3) classical.jpg', 3, ['Classical']],
            ['musician (2) modern.jpg', 2, ['Pop', 'Rock']],
            ['musician (2) modern 3.jpg', 2, ['Pop', 'Rock']],
            ['musician (2) modern 2.jpg', 2, ['Pop', 'Rock']],
            ['musician (2) classical.jpg', 2, ['Classical']],
            ['musician (2) classical 2.jpg', 2, ['Classical']],
            ['musician (1) modern.jpg', 1, ['Pop', 'Rock']],
            ['musician (1) classical.jpg', 1, ['Classical']]
        ];
        
        UserFactory::new()->venue()->count(4)->create();

        foreach ($pictures as $picture) {
            UserFactory::new()->withPictureAndGenres($picture[0], $picture[1], $picture[2])->create();
        }

    }
}
