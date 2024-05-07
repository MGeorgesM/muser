<?php

namespace App\Http\Controllers;

use OpenAI;
use App\Models\User;
use App\Models\Genre;
use App\Models\Instrument;
use App\Models\Location;
use App\Models\MusicianGenre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiMatchMakingController extends Controller
{
    public function getMatches(Request $request)
    {
        if (!auth()->user()->role_id == 2) {
            return response()->json(['error' => 'Only musicians can use this feature'], 403);
        }

        $currentUserLocation = auth()->user()->location_id;
        $currentUserLocation = Location::find($currentUserLocation)->name;

        $apiKey = getenv('OPENAI_API_KEY');
        $client = OpenAI::client($apiKey);

        $availableGenres = Genre::all()->toArray();
        $availableGenres = json_encode($availableGenres);

        $availableInstruments = Instrument::all()->toArray();
        $availableInstruments = json_encode($availableInstruments);

        $availableLocations = Location::all()->toArray();
        $availableLocations = json_encode($availableLocations);

        $validatedData = $request->validate([
            'message' => 'required|string'
        ]);

        try {
            $result = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You're the music expert. From my message, extract up to two relevant musical genres, identify three locations near the specified place, and determine any instruments specified in my message or associated with mentioned musician roles. Ensure all matches are drawn from predefined lists in the app. For example, if I say 'I need a singer and a drummer for a jazz concert in Beirut,' identify 'jazz' as the genre, 'Beirut' and nearby locations, and 'vocals' for the singer, 'percussion' for the drummer from the lists."
                    ],
                    [
                        'role' => 'system',
                        'content' => "My location is: " . $currentUserLocation
                    ],
                    [
                        'role' => 'system',
                        'content' => "Genres to consider: " . $availableGenres
                    ],
                    [
                        'role' => 'system',
                        'content' => "Instruments to consider:  " . $availableInstruments
                    ],
                    [
                        'role' => 'system',
                        'content' => "Please select three locations close to the specified location based on the provided list: " . $availableLocations . ". Use this information to identify locations that are geographically proximate to the given location. if no location is mentioned, consider the user's location as the reference point."
                    ],
                    [
                        'role' => 'system',
                        'content' => "Please provide the IDs of the two most relevant musical genres, the three nearest locations, and the IDs of any instruments you extracted from my message, all based on the provided lists. The response should be formatted as a JSON object with the keys: 'genreIds', 'locationIds', and 'instrumentIds'. Ensure accuracy in matching and formatting to facilitate seamless integration with our system."
                    ],
                    [
                        'role' => 'user',
                        'content' => $validatedData['message']
                    ],
                ],
                'response_format' => [
                    'type' => 'json_object'
                ],
            ]);

            // return response($result->choices[0]->message->content);

            $response = json_decode($result->choices[0]->message->content, true);

            if (!isset($response['genreIds'], $response['locationIds'], $response['instrumentIds'])) {
                return response()->json(['error' => 'Invalid response format from AI'], 422);
            }


            $matchedUsers = $this->matchUsers($response['genreIds'], $response['locationIds'], $response['instrumentIds']);

            return response()->json($matchedUsers);

        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    protected function matchUsers(array $genreIds, array $locationIds, array $instrumentIds)
    {
        $query = User::query()->where('role_id', 1);

        if (empty($genreIds) && empty($locationIds) && empty($instrumentIds)) {
            return response()->json(['error' => 'No search criteria provided'], 400);
        }

        if (!empty($genreIds)) {
            $userIdsFromGenres = MusicianGenre::whereIn('genre_id', $genreIds)->pluck('musician_id')->unique();
            $query = $query->whereIn('id', $userIdsFromGenres);
        }

        if (!empty($locationIds)) {
            $query = $query->whereIn('location_id', $locationIds);
        }

        if (!empty($instrumentIds)) {
            $query = $query->whereIn('instrument_id', $instrumentIds);
        }

        $users = $query->get();

        $users = $users->map(function ($user) {
            return $user->full_details;
        });
    }
}
