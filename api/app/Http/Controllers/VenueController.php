<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VenuesRating;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function getShowsByVenue($venueId, $status=null)
    {
        $venue = User::with('shows.band.members')->find($venueId);
        
        if (!$venue) {
            return response()->json(['error' => 'Venue not found'], 404);
        }
        
        if ($status) {
            $venue->shows = $venue->shows->filter(function ($show) use ($status) {
                return $show->status === $status;
            });
        }

        return response()->json($venue->shows, 200);
    }

    public function addUpdateRating(Request $request, $venueId)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
        ]);

        $rating = VenuesRating::where('venue_id', $venueId)->where('user_id', auth()->user()->id)->first();

        if($rating){
            $rating->rating = $request->rating;
            $rating->save();
            return response()->json($rating, 200);
        }

        $rating = new VenuesRating();
        $rating->rating = $request->rating;
        $rating->venue_id = $venueId;
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
