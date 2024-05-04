<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    public function getGenres()
    {
        $genres = Genre::all();

        return response()->json($genres);
    }
}
