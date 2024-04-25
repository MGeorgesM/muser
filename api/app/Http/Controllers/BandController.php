<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Band;

class BandController extends Controller
{
    public function getBandMembers($bandId)
    {
        $band = Band::with('members')->find($bandId);

        if (!$band) {
            return response()->json(['message' => 'Band not found'], 404);
        }

        return response()->json($band->members);
    }
}
