<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Models\Instrument;
use Illuminate\Http\Request;
use OpenAI;
use Illuminate\Support\Facades\Log;


class AiMatchMakingController extends Controller
{

    public function getMatch(Request $request)
    {
        $yourApiKey = getenv('OPENAI_API_KEY');
        $client = OpenAI::client($yourApiKey);

        $available_genres_in_db = Genre::all()->pluck('name')->toArray();
        $available_instruments_in_db = Instrument::all()->pluck('name')->toArray();

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
                    ['role' => 'system', 'content' => 'The extracted music genres should be included in this array of genres: ' . implode(", ", $available_genres_in_db)],
                    ['role' => 'system', 'content' => 'The extracted music genres should be included in this array of genres: ' . implode(", ", $available_genres_in_db)],
                    ['role' => 'system', 'content' => 'Return JSON format of the two music genres.'],

                    ['role' => 'user', 'content' => $request->message],
                ],
            ]);

            $response = $result->choices[0]->message->content;
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
