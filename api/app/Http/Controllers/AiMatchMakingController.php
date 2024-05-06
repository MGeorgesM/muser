<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Models\Instrument;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;


class AiMatchMakingController extends Controller
{

    public function generateAssistantResponse(Request $request)
    {

        $available_genres_in_db = Genre::all()->pluck('name')->toArray();
        $available_instruments_in_db = Instrument::all()->pluck('name')->toArray();


        $request->validate([
            'message' => 'required|string'
        ]);

        $result = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'responseo_format' => 'json',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a music expert, you can help me find the music genre from my message which may include songs or artists'],
                ['role' => 'system', 'content' => 'You should extract two music genres that goes with my message that may includes artists and or songs.'],
                ['role' => 'system', 'content' => 'You should suggest the closest genres that goes wiht my input from this array of genres: ' . implode(", ", $available_genres_in_db)],
                ['role' => 'system', 'content' => 'Always return JSON format no text.'],

                ['role' => 'user', 'content' => $request->message],              
            ],
        ]);

        echo $result->choices[0]->message->content; // Hello! How can I assist you today?
    }
}
