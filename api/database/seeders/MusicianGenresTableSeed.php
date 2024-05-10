<?php

namespace Database\Seeders;


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

        $excludedGenreIds = Genre::whereIn('name', ['Pop', 'Rock', 'Classical'])->pluck('id');

        foreach ($musicians as $musician) {

            if (str_contains($musician->picture, 'modern')) {
                $filteredGenres = $genres->whereNotIn('id', $excludedGenreIds);
            } elseif (str_contains($musician->picture, 'classical')) {
                $filteredGenres = $genres->whereIn('name', ['Classical']);
            } else {
                $filteredGenres = $genres->whereNotIn('name', ['Classical']);
            }

            $genre = $filteredGenres->random();
            MusicianGenre::create([
                'musician_id' => $musician->id,
                'genre_id' => $genre->id
            ]);

            $additionalGenres = $filteredGenres->except($genre->id)->random(rand(0, 3));
            foreach ($additionalGenres as $genre) {
                MusicianGenre::updateOrCreate(
                    ['musician_id' => $musician->id, 'genre_id' => $genre->id],
                    ['musician_id' => $musician->id, 'genre_id' => $genre->id]
                );
            }
        }
    }
}
