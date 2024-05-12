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

        if (empty($userIds) || empty($body)) {
            return response()->json(['success' => false, 'error' => 'Missing parameters']);
        }

        if (empty($title)) {
            $currentUserName = auth()->user()->name;
            $title = "$currentUserName sent you a message";
        }

        $users = User::whereIn('id', $userIds)->get();

        $factory = (new Factory)->withServiceAccount(storage_path('app/muser_adminsdk_service.json'));
        $messaging = $factory->createMessaging();

        $data = [
            'notifee' => json_encode([
                'title' => $title,
                'body' => $body,
                'android' => [
                    'channelId' => 'default',
                    'actions' => [
                        [
                            'title' => 'Mark as Read',
                            'pressAction' => [
                                'id' => 'read',
                            ],
                        ],
                    ],
                ],
            ]),
        ];

        foreach ($users as $user) {
            if (!empty($user->fcmtoken)) {
                $message = CloudMessage::withTarget('token', $user->fcmtoken)
                    ->withNotification(Notification::create($title, $body))
                    ->withData($data);

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
