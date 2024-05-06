<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class AiMatchMakingController extends Controller
{
    function analyzePrompt($prompt) {
        $client = new Client();
        $response = $client->post('https://api.openai.com/v1/engines/davinci/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'prompt' => $prompt,
                'max_tokens' => 150
            ]
        ]);
    
        $body = $response->getBody();
        $responseArray = json_decode($body, true);
        return $responseArray['choices'][0]['text'];
    }
}
