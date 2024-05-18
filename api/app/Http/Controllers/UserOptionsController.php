<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Genre;

class UserOptionsController extends Controller
{
    public function getGenres()
    {
        $genres = Genre::all();
        return response()->json($genres);
    }    
}
