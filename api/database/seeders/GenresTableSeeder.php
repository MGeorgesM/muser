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
        $genre->name = 'Rock';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Pop';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Jazz';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Blues';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Classical';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Country';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Hip hop';
        $genre->save();

        $genre = new Genre();
        $genre->name = 'Arabic';
        $genre->save();
    }
}
