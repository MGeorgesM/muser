<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Models\Instrument;
use App\Models\Location;
use Illuminate\Http\Request;
use OpenAI;
use Illuminate\Support\Facades\Log;


class AiMatchMakingController extends Controller
{

    public function getMatch(Request $request)
    {


        $currect_user_instrument_id = auth()->user()->instrument_id;
        $currect_user_instrument = Instrument::find($currect_user_instrument_id)->name;

        // dd($currect_user_instrument);

        $yourApiKey = getenv('OPENAI_API_KEY');
        $client = OpenAI::client($yourApiKey);

        $available_genres_in_db = Genre::all()->pluck('name')->toArray();
        $available_instruments_in_db = Instrument::all()->pluck('name')->toArray();
        $available_locations_in_db = Location::all()->pluck('name')->toArray();

        $request->validate([
            'message' => 'required|string'
        ]);

        try {
            $result = $client->chat()->create([
                'model' => 'gpt-3.5-turbo-0125',
                'response_format' => [
                    'type' => 'json_object'
                ],
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a music expert, find the music genre from my message that include songs or artists'],
                    ['role' => 'system', 'content' => 'The extracted music genre should be included in this array of genres, if multiple genres applicable choose 2 maximum: ' . implode(", ", $available_genres_in_db)],
                    ['role' => 'system', 'content' => 'My message may include a location, you should extract it and pick 3 locations that are close to it available in this array: ' . implode(", ", $available_locations_in_db)],
                    ['role' => 'system', 'content' => 'My message may include an instrument, you should extract it and return the closest instrument found in this array: ' . implode(", ", $available_instruments_in_db)],
                    ['role' => 'system', 'content' => 'Return JSON format of the music genres found, the closest 3 location. if not found return empty array'],

                    ['role' => 'user', 'content' => $request->message],
                ],
            ]);

            $response = $result->choices[0]->message->content;
            return response($response);
        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
