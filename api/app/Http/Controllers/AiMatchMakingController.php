<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Models\Instrument;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;


class AiMatchMakingController extends Controller
{

    public function generateAssistantResponse(Request $request)
    {

        $available_genres_in_db = Genre::all()->pluck('name')->toArray();
        $available_instruments_in_db = Instrument::all()->pluck('name')->toArray();

        $request->validate([
            'message' => 'required|string'
        ]);

        try {
            $result = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'response_format' => 'json',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a music expert, you can help me find the music genre from my message which may include songs or artists'],
                    ['role' => 'system', 'content' => 'You should extract two music genres that goes with my message that may includes artists and or songs.'],
                    ['role' => 'system', 'content' => 'You should suggest the closest genres that goes wiht my input from this array of genres: ' . implode(", ", $available_genres_in_db)],
                    ['role' => 'system', 'content' => 'Always return JSON format no text.'],

                    ['role' => 'user', 'content' => $request->message],
                ],
            ]);

            $response = $result->choices[0]->message->content;
            return response()->json($response);
        } catch (\Exception $th) {
            Log::error('Failed to generate response from OpenAI: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to process your request'], 500);
        }
    }
}
