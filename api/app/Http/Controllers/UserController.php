<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    public function getUser($id)
    {
        $user = User::findOrFail($id);

        return response()->json(['user' => $user->full_details]);
    }

    public function getUsersByRole($role)
    {
        $users = User::whereHas('role', function ($query) use ($role) {
            $query->where('name', $role);
        })
            ->get();

        return response()->json($users->map->full_details);
    }

    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'about' => 'required|string|max:120',
            'picture' => 'required|string',
            'location' => 'required|string',
            'availability_id' => 'nullable|exists:availabilities,id',
            'experience_id' => 'nullable|exists:experiences,id',
            'instrument_id' => 'nullable|exists:instruments,id',
            'venue_type_id' => 'nullable|exists:venue_types,id',
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->about = $request->input('about');

        $user->location = $request->input('location');
        $user->availability_id = $request->input('availability_id');
        $user->experience_id = $request->input('experience_id');
        $user->instrument_id = $request->input('instrument_id');
        $user->venue_type_id = $request->input('venue_type_id');


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
}
