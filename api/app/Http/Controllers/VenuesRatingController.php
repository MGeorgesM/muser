<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VenuesRating;

class VenuesRatingController extends Controller
{
    public function addUpdateRating(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'venue_id' => 'required|exists:users,id',
        ]);

        $rating = VenuesRating::where('venue_id', $request->venue_id)->where('user_id', auth()->user()->id)->first();

        if($rating){
            $rating->rating = $request->rating;
            $rating->save();
            return response()->json($rating, 200);
        }

        $rating = new VenuesRating();
        $rating->rating = $request->rating;
        $rating->venue_id = $request->venue_id;
        $rating->user_id = auth()->user()->id;

        $rating->save();

        return response()->json($rating, 201);
    }

    public function getVenueAverageRating($venueId)
    {
        $averageRating = VenuesRating::where('venue_id', $venueId)->avg('rating');

        return response()->json(['average_rating' => $averageRating]);
    }
}
