<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class VenueController extends Controller
{
    public function getShowsByVenue($venueId, $status = null)
    {
        $venue = User::with(['bookingsAsVenue.show' => function ($query) use ($status) {
            if ($status) {
                $query->where('status', $status);
            }
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
