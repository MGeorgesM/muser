<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genre = new Genre();
        $genre->name = 'rock';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'pop';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'jazz';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'blues';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'classical';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'country';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'hip hop';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'metal';
        $genre->save();
    }
}
