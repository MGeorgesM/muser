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
            'name' => 'required|max:60',
            'description' => 'required|max:120',
            'band_id' => 'required|exists:bands,id',
            'venue_id' => 'required|exists:users,id',
            'date' => 'required|date_format:Y-m-d\TH:i:s',
            'duration' => 'required|integer',
            'picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $show = new Show();
        $show->name = $request->name;
        $show->description = $request->description;
        $show->band_id = $request->band_id;
        $show->venue_id = $request->venue_id;
        $show->date = $request->date;
        $show->duration = $request->duration;

        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move(public_path('/show-pictures/'), $filename);

            if (File::exists(public_path('/show-pictures/') . $show->picture)) {
                File::delete(public_path('/show-pictures/') . $show->picture);
            }

            $show->picture = $filename;
        }

        $show->save();

        return response()->json($show, 201);
    }

    public function getShow(Request $request, $showId = null)
    {
        if ($showId) {
            $show = Show::with([
                'band.members' => function ($query) {
                    $query->select('id', 'name', 'picture', 'instrument_id')
                        ->with('instrument:id,name');
                },
                'band',
                'venue:id,name'
            ])->find($showId);

            if (!$show) {
                return response()->json(['message' => 'Show not found'], 404);
            }

            $show->band->members = $show->band->members->map(function ($member) {
                $member->instrument = $member->instrument->name;
                return $member;
            });

            $show->venue_name = $show->venue->name;

            return response()->json($show);
        }

        $status = $request->query('status');
        $shows = Show::with(['band.members:id,name,picture', 'band', 'venue:id,name'])
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->get();

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

        // $show_venue_id = $show->venu_id;

        // if ($show_venue_id !== auth()->user()->id) {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }

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

        if (File::exists(public_path('/show-pictures/') . $show->picture)) {
            File::delete(public_path('/show-pictures/') . $show->picture);
        }

        $show->delete();

        return response()->json(['message' => 'Show deleted'], 200);
    }
}
