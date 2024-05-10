<?php

namespace Database\Seeders;

use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pictures = [
            ['musician (6) modern.jpg', 6],
            ['musician (6) modern 2.jpg', 6],
            ['musician (6) classical.jpg', 6],
            ['musician (5) modern.jpg', 5],
            ['musician (5) modern 3.jpg', 5],
            ['musician (5) modern 2.jpg', 5],
            ['musician (5) classical.jpg', 5],
            ['musician (5) classical 2.jpg', 5],
            ['musician (4) modern.jpg', 4],
            ['musician (4) modern 3.jpg', 4],
            ['musician (4) modern 2.jpg', 4],
            ['musician (3) modern.jpg', 3],
            ['musician (3) classical.jpg', 3],
            ['musician (2) modern.jpg', 2],
            ['musician (2) modern 3.jpg', 2],
            ['musician (2) modern 2.jpg', 2],
            ['musician (2) classical.jpg', 2],
            ['musician (2) classical 2.jpg', 2],
            ['musician (1) modern.jpg', 1],
            ['musician (1) classical.jpg', 1]
        ];
        
        UserFactory::new()->venue()->count(4)->create();

        foreach ($pictures as $picture) {
            UserFactory::new()->withPicture($picture[0], $picture[1])->create();
        }

    }
}
