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
            'messages' => [
                ['role' => 'system', 'content' => 'You are a music expert, the user will insert an artist name in his message and you will provide the two music genres that goes with this artist.'],
                ['role' => 'systme', 'content' => 'You should provide the two music genres that goes with this artist. If you do not know the artist, you can say "I do not know this artist".'],
                

            ],
        ]);

        $result = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => 'Hello!'],
            ],
        ]);

        echo $result->choices[0]->message->content; // Hello! How can I assist you today?
    }
}
