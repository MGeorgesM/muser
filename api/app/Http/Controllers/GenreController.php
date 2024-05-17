<?php

namespace App\Http\Controllers;

use App\Models\Genre;

class GenreController extends Controller
{
    public function getGenres()
    {
        $genres = Genre::all();

        return response()->json($genres);
    }
}
