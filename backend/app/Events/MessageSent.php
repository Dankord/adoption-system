<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use App\Models\Message;

class MessageSent implements ShouldBroadcastNow
{
    use InteractsWithSockets;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load(['sender', 'conversation']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('chat.' . $this->message->conversation_id),
        ];
    }
}
