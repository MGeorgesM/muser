<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;



class AiMatchMakingController extends Controller

{
    public function generateAssistantsResponse(Request $request)
    {
        $assistantId = 'asst_H9CXvY23KTcANHSXiWlUE2lQ';
        $userMessage = $request->message;

        [$thread, $message, $run] = $this->createThreadAndRun($assistantId, $userMessage);

        $run = $this->waitOnRun($run, $thread->id);

        if ($run->status == 'completed') {
            $messages = $this->getMessages($run->threadId, 'asc', $message->id);

            $messagesData = $messages->data;

            if (!empty($messagesData)) {
                $messagesCount = count($messagesData);
                $assistantResponseMessage = '';

                if ($messagesCount > 1) {
                    foreach ($messagesData as $message) {
                        $assistantResponseMessage .= $message->content[0]->text->value . "\n\n";
                    }

                    $assistantResponseMessage = rtrim($assistantResponseMessage);
                } else {
                    $assistantResponseMessage = $messagesData[0]->content[0]->text->value;
                }

                return response()->json([
                    "assistant_response" => $assistantResponseMessage,
                ]);
            } else {
                Log::error('Something went wrong; assistant didn\'t respond');
            }
        } else {
            Log::error('Something went wrong; assistant run wasn\'t completed successfully');
        }
    }


    private function submitMessage($assistantId, $threadId, $userMessage)
    {
        $message = OpenAI::threads()->messages()->create($threadId, [
            'role' => 'user',
            'content' => $userMessage,
        ]);

        $run = OpenAI::threads()->runs()->create(
            threadId: $threadId,
            parameters: [
                'assistant_id' => $assistantId,
            ],
        );

        return [
            $message,
            $run
        ];
    }


    private function createThreadAndRun($assistantId, $userMessage)
    {
        $thread = OpenAI::threads()->create([]);

        [$message, $run] = $this->submitMessage($assistantId, $thread->id, $userMessage);

        return [
            $thread,
            $message,
            $run
        ];
    }

    private function waitOnRun($run, $threadId)
    {
        while ($run->status == "queued" || $run->status == "in_progress") {
            $run = OpenAI::threads()->runs()->retrieve(
                threadId: $threadId,
                runId: $run->id,
            );

            sleep(1);
        }

        return $run;
    }

    private function getMessages($threadId, $order = 'asc', $messageId = null)
    {
        $params = [
            'order' => $order,
            'limit' => 10
        ];

        if ($messageId) {
            $params['after'] = $messageId;
        }

        return OpenAI::threads()->messages()->list($threadId, $params);
    }

    // function analyzePrompt($prompt)
    // {

    //     $client = new Client();
    //     $apiKey = env('OPENAI_API_KEY');
    //         // dd($apiKey);
    //     ;

    //     $response = $client->post('https://api.openai.com/v1/completions', [
    //         'headers' => [
    //             'Authorization' => 'Bearer ' . 'sk-proj-qUoHGKqBJ8Un0geALXtMT3BlbkFJ7PhPMj9pt9TNS1ANfOpJ',
    //             'Content-Type' => 'application/json',
    //         ],
    //         'json' => [
    //             'model' => 'text-davinci-003',
    //             'prompt' => $prompt,
    //             'max_tokens' => 150
    //         ]
    //     ]);

    //     $body = $response->getBody();
    //     $responseArray = json_decode($body, true);
    //     return $responseArray['choices'][0]['text'];
    // }


    // public function getMatch(Request $request)
    // {
    //     $prompt = $request->input('prompt');
    //     $response = $this->analyzePrompt($prompt);
    //     return response()->json(['response' => $response]);
    // }

    // public function categorizeResponse($response)
    // {
    //     $keywords = Genre::all()->pluck('name')->toArray();
    // }
}
