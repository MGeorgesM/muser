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

    public function getMatch(Request $request)
    {

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
                        'content' => "You're the music expert. Identify 2 relevant musical genres from the artist or song or a genre that I specify, 3 close locations to me or the location I specify, and the instruments I specify from my message. Use only the provided lists for matching."
                    ],
                    [
                        'role' => 'system',
                        'content' => "My location is " . $currentUserLocation
                    ],
                    [
                        'role' => 'system',
                        'content' => "Genres to consider: " . $availableGenres
                    ],
                    [
                        'role' => 'system',
                        'content' => "Potential instruments if i mentioned an instrument: " . $availableInstruments
                    ],
                    [
                        'role' => 'system',
                        'content' => "Possible locations: " . $availableLocations . " you must select 3 locations close to me or the location I specify."
                    ],
                    [
                        'role' => 'system',
                        'content' => 'Return the IDs of the two closest matching genres, the three closest locations, and the IDs of the instruments mentioned in the message. In JSON object format'
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

            $response = $result->choices[0]->message->content;
            return response($response);
        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    protected function matchUsers(array $genreIds, array $locationIds, array $instrumentIds)
    {
          
        $users = User::query();
    
        if (empty($genreIds) && empty($locationIds) && empty($instrumentIds)) {
            return response()->json(['error' => 'No search criteria provided'], 400);
        }
    
        if (!empty($genreIds)) {
            $userIdsFromGenres = MusicianGenre::whereIn('genre_id', $genreIds)->pluck('musician_id')->unique();
            $users = $users->whereIn('id', $userIdsFromGenres);
        }
    
        if (!empty($locationIds)) {
            $users = $users->whereIn('location_id', $locationIds);
        }
    
        if (!empty($instrumentIds)) {
            $users = $users->whereIn('instrument_id', $instrumentIds);
        }
    
        return response()->json($users->get());
    }
    
}
