<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Band;
use App\Models\User;

class BandController extends Controller
{

    public function addBand(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'members' => 'required|array',
            'members.*' => 'exists:users,id',
        ]);

        $members = $request->members;

        $non_musicians = User::whereIn('id', $members)->where('role_id', '!=', 1)->get();

        if ($non_musicians->count() > 0) {
            return response()->json(['message' => 'All band members must be musicians'], 400);
        }

        if (count($members) < 2 || count($members) > 10) {
            return response()->json(['message' => 'A band must have at least 2 members and 10 members at most'], 400);
        }

        if (count($members) !== count(array_unique($members))) {
            return response()->json(['message' => 'A band cannot have duplicate members'], 400);
        }

        if (count($non_musicians) > 0) {
            return response()->json(['message' => 'A band can only have musicians as members'], 400);
        }

        $band = new Band();
        $band->name = $request->name;
        $band->save();

        $band->members()->attach($request->members);

        return response()->json($band, 201);
    }

    public function getBand($bandId = null)
    {

        if ($bandId) {
            $band = Band::with('members')->find($bandId);

            if (!$band) {
                return response()->json(['message' => 'Band not found'], 404);
            }

            return response()->json($band);
        } else {
            $bands = Band::with('members')->get();
            return response()->json($bands);
        }
    }

    public function getUserBands()
    {
        $user_id = auth()->user()->id;
    
        if (!$user_id) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $bands = Band::with('members')
            ->whereHas('members', function ($query) use ($user_id) {
                $query->where('users.id', $user_id);
            })
            ->get();
    
        return response()->json($bands);
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
