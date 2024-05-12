<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class NotificationsController extends Controller
{
    public function sendNotification(Request $request)
    {
        $userIds = $request->userIds;
        $title = $request->title;
        $body = $request->body; 

        $users = User::whereIn('id', $userIds)->get();

        $factory = (new Factory)->withServiceAccount(config('firebase.projects.app.credentials'));
        $messaging = $factory->createMessaging();

        foreach ($users as $user) {
            if (!empty($user->fcmtoken)) {
                $message = CloudMessage::withTarget('token', $user->fcmtoken)
                    ->withNotification(Notification::create($title, $body))
                    ->withData(['key' => 'value']);

                try {
                    $messaging->send($message);
                } catch (\Throwable $e) {
                    return response()->json(['success' => false, 'error' => $e->getMessage()]);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Notifications sent successfully']);
    }
}
