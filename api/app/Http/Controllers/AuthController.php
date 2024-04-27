<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized, Wrong email or Password'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => auth()->user()->full_details,
        ]);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'about' => 'required|string|max:120',
            'picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'location' => 'required|string',
            'availability_id' => 'exists:availabilities,id',
            'experience_id' => 'exists:experiences,id',
            'instrument_id' => 'exists:instruments,id',
            'venue_type_id' => 'exists:venue_types,id',
            'role_id' => 'exists:roles,id',
            'genres' => 'required|array',
            'genres.*' => 'exists:genres,id',
        ]);

        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->about = $request->about;
        $user->location = $request->location;
        $user->availability_id = $request->availability_id;
        $user->experience_id = $request->experience_id;
        $user->instrument_id = $request->instrument_id;
        $user->venue_type_id = $request->venue_type_id;
        $user->role_id = $request->role_id ?? 1;

        $file = $request->file('picture');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '.' . $extension;
        $file->move(public_path('/profile-pictures/'), $filename);

        $user->picture = $filename;

        $user->save();

        $user->genres()->attach($request->genres);

        $token = auth()->login($user);

        return response()->json([
            'token' => $token,
            'user' => $user->full_details,
        ], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
