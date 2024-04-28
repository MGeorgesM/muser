<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    public function getUser($id)
    {
        // if ($id) {
        //     $user = User::find($id);
        //     if (!$user) return response()->json(['message' => 'User not found'], 404);
        //     return response()->json(['user' => $user->full_details]);
        // } else {
        //     $current_user_id = auth()->id();
        //     $all_users = User::where('id', '!=', $current_user_id)->get();
        //     return response()->json($all_users->map->full_details);
        // }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        return response()->json(['user' => $user->full_details]);
    }

    public function getUsersByRole($role)
    {
        $current_user_id = auth()->id();
        $users = User::whereHas('role', function ($query) use ($role) {
            $query->where('name', $role);
        })->where('is_active', 1)->where('id', '!=', $current_user_id)->get();

        return response()->json($users->map->full_details);
    }

    public function updateUser(Request $request, $id = null)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $id,
            'about' => 'string|max:120',
            'picture' => 'image|mimes:jpeg,png,jpg|max:2048',
            'location_id' => 'integer|exists:locations,id',
            'availability_id' => 'exists:availabilities,id',
            'experience_id' => 'exists:experiences,id',
            'instrument_id' => 'exists:instruments,id',
            'venue_type_id' => 'exists:venue_types,id',
            'genres' => 'array',
            'genres.*' => 'exists:genres,id',
        ]);

        $user = User::find($id);

        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $request->name && $user->name = $request->input('name');
        $request->email && $user->email = $request->input('email');
        $request->about && $user->about = $request->input('about');
        $request->location_id && $user->location_id = $request->input('location_id');
        $request->availability_id && $user->availability_id = $request->input('availability_id');
        $request->experience_id && $user->experience_id = $request->input('experience_id');
        $request->instrument_id && $user->instrument_id = $request->input('instrument_id');
        $request->venue_type_id && $user->venue_type_id = $request->input('venue_type_id');

        $request->genres && $user->genres()->sync($request->input('genres'));

        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move(public_path('/profile-pictures/'), $filename);

            if (File::exists(public_path('/profile-pictures/') . $user->picture)) {
                File::delete(public_path('/profile-pictures/') . $user->picture);
            }

            $user->picture = $filename;
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function disableUser($id)
    {
        $user = User::find($id);

        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->is_active = 1;
        $user->save();

        return response()->json(['message' => 'User disabled successfully']);
    }
}
