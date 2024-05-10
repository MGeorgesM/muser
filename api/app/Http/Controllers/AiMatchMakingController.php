<?php

namespace App\Http\Controllers;

use App\Models\Experience;
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
    public function generateShowImage(Request $request)
    {
        $apiKey = getenv('OPENAI_API_KEY');
        $client = OpenAI::client($apiKey);

        $validatedData = $request->validate([
            'message' => 'required|string',
            'bandname' => 'required|string'
        ]);

        $show_descrpition = json_encode($validatedData['message']);
        $band_name = json_encode($validatedData['bandname']);
        $music_genre = $this->getGenre($show_descrpition);

        // dd($music_genre);

        $prompt = 'I have an app that displays music shows created by musicians, I want you to create an image for this music show poster. When generating the image, you should take in mind the band name: ' . $band_name . ', the show descripiton : ' . $show_descrpition . ' and the main music genre in this show: ' . $music_genre . 'The poster should include the band name, show description, and a background image that fits the show description, do not include people or animals in the design.';

        try {
            $response = $client->images()->create([
                'model' => 'dall-e-3',
                'style' => 'natural',
                'quality' => 'standard',
                'response_format' => 'url',
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1024',
            ]);

            $response->created;

            foreach ($response->data as $data) {
                $data->url;
                $data->b64_json;
            }

            $response->toArray();

            return response()->json($response->data[0]->url);
        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    protected function getGenre(string $description)
    {
        $apiKey = getenv('OPENAI_API_KEY');
        $client = OpenAI::client($apiKey);

        if (empty($description)) {
            return null;
        }

        $description = trim($description);
        $description = preg_replace('/[^a-zA-Z0-9 \'\.,-]/', '', $description);

        $availableGenres = Genre::all()->toArray();
        $availableGenres = json_encode($availableGenres);

        try {
            $result = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You're the music expert. From my message which represents a music show description, you must extract one relevant musical genre, either directly mentioned or inferred from artists or songs mentioned. Ensure the music genre is drawn from this predefined list: $availableGenres"
                    ],
                    [
                        'role' => 'system',
                        'content' => "You should return the id of the music genre you extracted from my message in JSON with key 'id'. Ensure accuracy in matching and formatting to facilitate seamless integration with our system."
                    ],
                    [
                        'role' => 'user',
                        'content' => $description
                    ],
                ],
                'response_format' => [
                    'type' => 'json_object'
                ],
            ]);

            $response = json_decode($result->choices[0]->message->content, true);
            return $response['id'] ?? null;  // Extract and return only the genre ID

        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return null;  // Return null on failure
        }
    }

    public function getMatches(Request $request)
    {
        if (!auth()->user()->role_id == 2) {
            return response()->json(['error' => 'Only musicians can use this feature'], 403);
        }

        $currentUserLocation = auth()->user()->location_id;
        $currentUserLocation = Location::find($currentUserLocation)->name;

        $apiKey = config('services.openai.api_key');
        $client = OpenAI::client($apiKey);

        $availableGenres = json_encode(Genre::all());
        $availableInstruments = json_encode(Instrument::all());
        $availableLocations = json_encode(Location::all());
        $availableExperiences = json_encode(Experience::all());


        $validatedData = $request->validate([
            'message' => 'required|string'
        ]);

        try {
            $result = $client->chat()->create([
                'model' => 'gpt-4-turbo-preview',
                'messages' => [
                    // [
                    //     'role' => 'system',
                    //     'content' => "Assist in extracting music preferences and user location details from the user's message. Utilize the lists provided to match closest genres, instruments, and locations. Ensure accurate matching for system integration."
                    // ],
                    [
                        'role' => 'system',
                        'content' => "You're the music expert. You'll receive my message that is posted on a musicians app that let's the user spontaneously form bands, my message is intented to quickly find and filter users that match what i wrote, this message could be related to anything in music, something i'm thinking about or planning to do or just single words."
                    ],
                    [
                        'role' => 'system',
                        'content' => "You must extract from my message what music genre i'm looking for, and find the nearest matching music genre available in the music genres list below and return it's id. My message also may not explicitly mention a music genre, in that case you must conclude it from artists or songs or anything that i've mentioned in my message and find the nearest matching music genre from the music genres list below and return it's id, if nothing related to a music genre can be concluded or found in my message you must the return all the music genres ids found in the music genres list below."
                    ],
                    [
                        'role' => 'system',
                        'content' => "My message may specify a location from Lebanon, if so you must return this location id from the locations list below, also my message may mention a location related to me ('near me, nearby...), if so, you have to find two locations from the locations list below that are geographically close to the my location that is also mentioned below. If nothing related to location was mentioned you must return all the locations ids from the locations list."
                    ],
                    [
                        'role' => 'system',
                        'content' => 'My message may also specify a certain musical instrument, if so you must return only the closest matching instrument id from the instruments list below, my message may also mention explicility not wanting a certain instrument, you should be aware of this and avoid returning the closest instrument id from the instruments list below, if no instrument was mentioned in my message you have to return all of the instrument ids available in the instruments list below'
                    ],
                    [
                        'role' => 'system',
                        'content' => 'My message may also specify a certain experience level, if so you must return only the closest matching experience id from the experiences list below, if no experience was mentioned in my message you have to return all of the experience ids available in the experiences list below'
                    ],
                    [
                        'role' => 'system',
                        'content' => "The response should be formatted as a JSON object with the keys: 'genreIds', 'locationIds', and 'instrumentIds' and 'experienceIds' with value of array of IDs that you return from my message. Ensure accuracy in matching and formatting."
                        // 'content' => "The response should be formatted as a JSON object with the keys: 'genres', 'locations', and 'instruments' and 'experiences' with value of array of IDs that you return from my message and their respective names. Ensure accuracy in matching and formatting."
                    ],
                    [
                        'role' => 'system',
                        'content' => "My location is: " . $currentUserLocation
                    ],
                    [
                        'role' => 'system',
                        'content' => "Locations List:" . $availableLocations
                    ],
                    [
                        'role' => 'system',
                        'content' => "Music Genres List:" . $availableGenres
                    ],
                    [
                        'role' => 'system',
                        'content' => "Instruments List:" . $availableInstruments
                    ],
                    [
                        'role' => 'system',
                        'content' => "Experiences List:" . $availableExperiences
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

            return response($result->choices[0]->message->content);

            $response = json_decode($result->choices[0]->message->content, true);

            // dd($response);

            if (!isset($response['genreIds'], $response['locationIds'], $response['instrumentIds'])) {
                return response()->json(['error_OpenAi' => 'Invalid response format from AI'], 422);
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
        $query = User::where('role_id', 1)->where('id', '!=', auth()->id());

        $lastValidResult = $query->get();

        if (!empty($genreIds)) {
            $userIdsFromGenres = MusicianGenre::whereIn('genre_id', $genreIds)->pluck('musician_id')->unique();
            $updatedQuery = $query->whereIn('id', $userIdsFromGenres);
            $newResult = $updatedQuery->get();

            if ($newResult->isNotEmpty()) {
                $lastValidResult = $newResult;
            }
        }

        if (!empty($locationIds)) {
            $updatedQuery = $query->whereIn('location_id', $locationIds);
            $newResult = $updatedQuery->get();

            if ($newResult->isNotEmpty()) {
                $lastValidResult = $newResult;
            }
        }

        if (!empty($instrumentIds)) {
            $updatedQuery = $query->whereIn('instrument_id', $instrumentIds);
            $newResult = $updatedQuery->get();

            if ($newResult->isNotEmpty()) {
                $lastValidResult = $newResult;
            }
        }

        return $lastValidResult->map(function ($user) {
            return $user->full_details;
        });
    }
}
