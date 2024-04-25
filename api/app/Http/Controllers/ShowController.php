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
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:100',
            'picture' => 'image|mimes:jpeg,png,jpg|max:2048',
            'date' => 'required|date',
            'duration' => 'required|integer',
        ]);

        $show = new Show();
        $show->name = $request->name;
        $show->description = $request->description;
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
            $show = Show::with(['band.members'])->find($showId);
            if (!$show) {
                return response()->json(['message' => 'Show not found'], 404);
            }
            return response()->json($show);
        }

        $shows = Show::with(['band.members'])->get();
        return response()->json($shows);
    }
}
