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

        $excludedGenreIds = Genre::whereIn('name', ['Pop', 'Rock', 'Classical'])->pluck('id')->toArray();

        foreach ($musicians as $musician) {

            if (str_contains($musician->picture, 'modern')) {

                $filteredGenres = $genres->whereNotIn('id', $excludedGenreIds);
            } elseif (str_contains($musician->picture, 'classical')) {

                $filteredGenres = $genres->whereNotIn('id', $excludedGenreIds);
            } else {

                $filteredGenres = $genres->whereNotIn('name', ['Classical']);
            }


            if ($filteredGenres->isEmpty()) {
                continue;
            }

            $genre = $filteredGenres->random();
            MusicianGenre::create([
                'musician_id' => $musician->id,
                'genre_id' => $genre->id
            ]);


            if ($filteredGenres->count() > 1) {
                $additionalGenres = $filteredGenres->where('id', '!=', $genre->id)->random(rand(0, min(3, $filteredGenres->count() - 1)));
                foreach ($additionalGenres as $additionalGenre) {
                    MusicianGenre::updateOrCreate(
                        ['musician_id' => $musician->id, 'genre_id' => $additionalGenre->id],
                        ['musician_id' => $musician->id, 'genre_id' => $additionalGenre->id]
                    );
                }
            }
        }
    }
}
