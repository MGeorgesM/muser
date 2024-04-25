<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class VenueController extends Controller
{
    public function getShowsByVenueStatus($venueId)
    {
        $venue = User::with(['bookingsAsVenue.show' => function ($query) {
            $query->where('status', 'accepted')
                  ->orWhere('status', 'pending');
        }])->find($venueId);

        if (!$venue) {
            return response()->json(['message' => 'Venue not found'], 404);
        }
        $shows = $venue->bookingsAsVenue->map(function ($booking) {
            return $booking->show;
        });

        return response()->json($shows);
    }
}
