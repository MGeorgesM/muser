<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    public function getUser($id)
    {
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

    public function getUsersByRole(Request $request, $role)
    {
        $current_user_id = auth()->id();

        $connectedUserIds = [];

        if ($role === 'musician') {
            $connectedUserIds = Connection::where('user_one_id', $current_user_id)
                ->orWhere('user_two_id', $current_user_id)
                ->get()
                ->map(function ($conn) use ($current_user_id) {
                    return $conn->user_one_id === $current_user_id ? $conn->user_two_id : $conn->user_one_id;
                })->all();
        }

        $connectedUsers = User::whereIn('id', $connectedUserIds)
            ->whereHas('role', function ($query) use ($role) {
                $query->where('name', $role);
            })
            ->where('is_active', 1)
            ->get()
            ->map->full_details;

        if ($request->query('connected')) {
            return response()->json($connectedUsers);
        }

        $otherUsers = User::whereHas('role', function ($query) use ($role) {
            $query->where('name', $role);
        })
            ->where('is_active', 1)
            ->where('id', '!=', $current_user_id)
            ->whereNotIn('id', $connectedUserIds)
            ->get()
            ->map->full_details;

        $otherUsers = $otherUsers->shuffle();


        return response()->json([
            'connectedUsers' => $connectedUsers,
            'feedUsers' => $otherUsers
        ]);
    }


    public function updateUser(UpdateUserRequest $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->fill($request->validated());

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

    // public function addConnection($id)
    // {
    //     if (!$id) return response()->json(['message' => 'No user ID provided'], 400);

    //     $userOneId = auth()->id();
    //     $userTwoId = $id;

    //     if ($userOneId == $userTwoId) return response()->json(['message' => 'You cannot connect with yourself'], 400);

    //     $sortedIds = [$userOneId, $userTwoId];
    //     sort($sortedIds);

    //     Connection::firstOrCreate([
    //         'user_one_id' => $sortedIds[0],
    //         'user_two_id' => $sortedIds[1]
    //     ]);

    //     $userTwo = User::find($userTwoId);

    //     return response()->json(['message' => 'Connection added successfully', 'user' => $userTwo->full_details]);
    // }

    public function addConnections(Request $request)
    {
        $userIds = $request->input('userIds', []);

        if (empty($userIds)) {
            return response()->json(['message' => 'No user IDs provided'], 400);
        }

        $userOneId = auth()->id();
        $connections = [];
        $failedConnections = [];

        foreach ($userIds as $userTwoId) {
            if ($userOneId == $userTwoId) {
                $failedConnections[] = $userTwoId;
                continue;
            }

            $sortedIds = [$userOneId, $userTwoId];
            sort($sortedIds);

            $connection = Connection::firstOrCreate([
                'user_one_id' => $sortedIds[0],
                'user_two_id' => $sortedIds[1]
            ]);

            if ($connection->wasRecentlyCreated) {
                $userTwo = User::find($userTwoId);
                $connections[] = $userTwo->full_details;
            }
        }

        return response()->json([
            'message' => 'Connections processed',
            'connections' => $connections,
            'failed' => $failedConnections
        ]);
    }


    public function disableUser($id)
    {
        $user = User::find($id);

        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->is_active = 1;
        $user->save();

        return response()->json(['message' => 'User disabled successfully']);
    }

    protected function updateProfilePicture(Request $request, User $user)
    {
        $file = $request->file('picture');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '.' . $extension;
        $destinationPath = public_path('/profile_pictures/');

        if (File::exists($destinationPath . $user->picture)) {
            File::delete($destinationPath . $user->picture);
        }

        $file->move($destinationPath, $filename);

        return $filename;
    }
}
