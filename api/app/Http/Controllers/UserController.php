<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Connection;
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

        if (!$id) {
            $current_user_id = auth()->id();
            $user = User::find($current_user_id);
            return response()->json(['user' => $user->full_details]);
        } else {
            $user = User::find($id);
            if (!$user) return response()->json(['message' => 'User not found'], 404);
            return response()->json(['user' => $user->full_details]);
        }
    }
    public function getUsersPicturesAndNames(Request $request)
    {
        $ids = $request->query('ids');

        if (empty($ids)) {
            return response()->json(['message' => 'No IDs provided'], 400);
        }

        $users = User::whereIn('id', $ids)->get();

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found'], 404);
        }

        $result = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'picture' => $user->picture,
                'name' => $user->name
            ];
        });

        return response()->json($result);
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

        $this->validateRequest($request, $id);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userData = $request->only([
            'name', 'email', 'about', 'location_id', 'availability_id',
            'experience_id', 'instrument_id', 'venue_type_id'
        ]);

        $user->fill($userData);

        if ($request->has('genres')) {
            $user->genres()->sync($request->genres);
        }

        if ($request->hasFile('picture')) {
            $user->picture = $this->updateProfilePicture($request, $user);
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user->full_details]);
    }

    public function getConnections()
    {
        $userId = auth()->id();
        $connections = User::whereHas('connectionsAsOne', function ($query) use ($userId) {
            $query->where('user_two_id', $userId);
        })->orWhereHas('connectionsAsTwo', function ($query) use ($userId) {
            $query->where('user_one_id', $userId);
        })->select('id', 'name', 'picture')->get();

        return response()->json($connections);
    }


    public function addConnection($id)
    {

        if (!$id) return response()->json(['message' => 'No user ID provided'], 400);

        $userOneId = auth()->id();
        $userTwoId = $id;

        if ($userOneId == $userTwoId) return response()->json(['message' => 'You cannot connect with yourself'], 400);

        $sortedIds = [$userOneId, $userTwoId];
        sort($sortedIds);

        Connection::firstOrCreate([
            'user_one_id' => $sortedIds[0],
            'user_two_id' => $sortedIds[1]
        ]);

        return $this->getConnections();
    }

    public function disableUser($id)
    {
        $user = User::find($id);

        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->is_active = 1;
        $user->save();

        return response()->json(['message' => 'User disabled successfully']);
    }

    protected function validateRequest($request, $id)
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
    }

    protected function updateProfilePicture(Request $request, User $user)
    {
        $file = $request->file('picture');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '.' . $extension;
        $destinationPath = public_path('/profile-pictures/');

        if (File::exists($destinationPath . $user->picture)) {
            File::delete($destinationPath . $user->picture);
        }

        $file->move($destinationPath, $filename);

        return $filename;
    }
}
