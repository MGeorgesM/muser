<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Show;

class ShowController extends Controller
{
    public function getShow(Request $request, $showId = null)
    {
        if ($showId) {
            $show = Show::with(['band.members'])->find($showId);
            if (!$show) {
                return response()->json(['message' => 'Show not found'], 404);
            }
            return response()->json($show);
        }

        $shows = Show::with(['band.members'])->get();
        return response()->json($shows);
    }

}
