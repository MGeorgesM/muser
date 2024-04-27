<?php

namespace Database\Seeders;

use Database\Factories\MusicianGenreFactory;
use Illuminate\Database\Seeder;
use App\Models\MusicianGenre;
use App\Models\User;
use App\Models\Genre;

class MusicianGenresTableSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $musicians = User::where('role_id', 1)->get();
    $genres = Genre::all();

    foreach ($musicians as $musician) {

        $genre = $genres->random();
        MusicianGenre::create([
            'musician_id' => $musician->id,
            'genre_id' => $genre->id
        ]);

        $additionalGenres = $genres->random(rand(0, 3));
        foreach ($additionalGenres as $genre) {
            MusicianGenre::updateOrCreate(
                ['musician_id' => $musician->id, 'genre_id' => $genre->id],
                ['musician_id' => $musician->id, 'genre_id' => $genre->id]
            );
        }
    }
}
}
