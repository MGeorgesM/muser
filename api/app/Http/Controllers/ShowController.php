<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use App\Models\Show;

class ShowController extends Controller
{
    public function addShow(Request $request)
    {
        $request->validate([
            'band_id' => 'required|exists:bands,id',
            'venue_id' => 'required|exists:users,id',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer',
            'genre_id' => 'required|exists:genres,id',
            // 'picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $show = new Show();
        $show->band_id = $request->band_id;
        $show->date = $request->date;
        $show->time = $request->time;
        $show->duration = $request->duration;
        $show->venue_id = $request->venue_id;
        $show->genre_id = $request->genre_id;

        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move(public_path('/show-pictures/'), $filename);

            if (File::exists(public_path('/show_pictures/') . $show->picture)) {
                File::delete(public_path('/show_pictures/') . $show->picture);
            }

            $show->picture = $filename;
        }

        $show->save();

        $show = Show::with([
            'venue:id,name',
            'genre:id,name',
            'band.members' => function ($query) {
                $query->select('users.id', 'users.name', 'users.picture', 'users.instrument_id')
                      ->with(['instrument:id,name']);
            }
        ])->find($show->id);

        return response()->json($show, 201);
    }

    public function getShows(Request $request, $showId = null)
    {
        if ($showId) {
            $show = Show::with([
                'venue:id,name,venue_name',
                'genre:id,name',
                'band.members' => function ($query) {
                    $query->select('users.id', 'users.name', 'users.picture', 'users.instrument_id')
                        ->with(['instrument:id,name']);
                }
            ])->find($showId);

            if (!$show) {
                return response()->json(['message' => 'Show not found'], 404);
            }

            return response()->json($show);
        }

        $venueId = $request->query('venue_id');
        $showStatus = $request->query('status');

        $query = Show::with([
            'venue:id,name,venue_name,location_id',
            'venue.location:id,name',
            'genre:id,name',
            'band.members' => function ($query) {
                $query->select('users.id', 'users.name', 'users.picture', 'users.instrument_id')
                    ->with(['instrument:id,name']);
            }
        ]);

        if ($venueId) {
            $query->where('venue_id', $venueId);
        }

        if ($showStatus) {
            $query->where('status', $showStatus);
        }

        $query->orderBy('date');
        $shows = $query->get();

        return response()->json($shows);
    }

    public function updateShow(Request $request)
    {
        $request->validate([
            'show_id' => 'required|exists:shows,id',
            'status' => 'required|in:pending,set,live,cancelled',
        ]);

        $show = Show::find($request->show_id);

        if (!$show) {
            return response()->json(['message' => 'Show not found'], 404);
        }

        $show->status = $request->status;

        $show->save();

        return response()->json($show, 200);
    }

    public function deleteShow($showId)
    {
        $show = Show::find($showId);

        if (!$show) {
            return response()->json(['message' => 'Show not found'], 404);
        }

        if (File::exists(public_path('/show_pictures/') . $show->picture)) {
            File::delete(public_path('/show_pictures/') . $show->picture);
        }

        $show->delete();

        return response()->json(['message' => 'Show deleted'], 200);
    }
}
