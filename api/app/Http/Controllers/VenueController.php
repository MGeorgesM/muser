<?php

namespace App\Http\Controllers;

use App\Models\User;

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
}
