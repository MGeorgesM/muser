<?php

namespace App\Http\Controllers;

use App\Models\User;

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
}
