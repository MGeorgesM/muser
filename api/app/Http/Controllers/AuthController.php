<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\User;
use App\Models\Location;
use App\Models\Experience;
use App\Models\Instrument;
use App\Models\VenueType;
use App\Models\Genre;

use GetStream\StreamChat\Client as Client;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'getProperties', 'checkEmail']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized, Wrong email or Password'], 401);
        }

        $stream_token = $this->generateStreamToken();

        return response()->json([
            'token' => $token,
            'stream_token' => $stream_token,
            'user' => auth()->user()->full_details,
        ]);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated() + [
            'password' => $request->password,
            'role_id' => $request->role_id ?? 1,

        ]);

        $user->picture = $this->handleFileUpload($request);

        $user->genres()->attach($request->genres);

        $user->save();

        $token = auth()->login($user);

        $stream_token = $this->generateStreamToken();

        return response()->json([
            'token' => $token,
            'stream_token' => $stream_token,
            'user' => $user->full_details,
        ], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        if ($request->query('flat')) {
            return response()->json(auth()->user());
        }
        
        return response()->json(auth()->user()->full_details);
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

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $email = $request->email;

        $user = User::where('email', $email)->first();

        if ($user) {
            return response()->json(['message' => 'Email already exists'], 401);
        }

        return response()->json(['message' => 'Email is available'], 200);
    }

    public function generateStreamToken()
    {
        $api_key = config('services.stream.api_key');
        $api_secret = config('services.stream.api_secret');

        $serverClient = new Client($api_key, $api_secret);

        return $serverClient->createToken(auth()->user()->id);
    }

    public function getProperties()
    {
        return response()->json([
            'musician' => [
                'Instrument' => Instrument::all(),
                'Experience' => Experience::all(),
                'Music Genres' => Genre::all(),
            ],
            'venue' => [
                'Venue Type' => VenueType::all(),
            ],
            'general' => [
                'Location' => Location::all(),
            ],
        ]);
    }

    protected function handleFileUpload($request)
    {
        if (!$request->hasFile('picture')) {
            return null;
        }

        $file = $request->file('picture');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('/profile_pictures/'), $filename);

        return $filename;
    }
}
