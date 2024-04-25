<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getUser($id)
    {
        $user = User::with('role', 'bands', 'genres', 'instrument', 'venueType')->findOrFail($id);
        
        return response()->json(['user' => $user->append('full_details')]);
    }

    public function getUsersByRole($role)
    {
            
       
        $users = User::with(['role', 'genres', 'instrument', 'venueType', 'shows', 'givenRatings', 'receivedRatings', 'availability', 'experience'])
                    ->whereHas('role', function ($query) use ($roleName) {
                        $query->where('name', $roleName);
                    })
                    ->get();

        return response()->json($users);
    }
}
