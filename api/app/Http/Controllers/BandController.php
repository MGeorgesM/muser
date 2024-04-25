<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Band;

class BandController extends Controller
{

    public function addBand(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'members' => 'required|array',
            'members.*' => 'exists:users,id',
        ]);

        $band = new Band();
        $band->name = $request->name;
        $band->save();

        $band->members()->attach($request->members);

        return response()->json($band, 201);
    }

    public function getBandMembers($bandId)
    {
        $band = Band::with('members')->find($bandId);

        if (!$band) {
            return response()->json(['message' => 'Band not found'], 404);
        }

        return response()->json($band->members);
    }

    public function deleteBand($bandId)
    {
        $band = Band::find($bandId);

        if (!$band) {
            return response()->json(['message' => 'Band not found'], 404);
        }

        $band->delete();

        return response()->json(['message' => 'Band deleted'], 200);
    }
}
