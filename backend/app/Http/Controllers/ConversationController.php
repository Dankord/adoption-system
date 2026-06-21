<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::with([
            'latestMessage',
            'owner' => fn($q) => $q->with('customer:id,customer_name'),
            'customer' => fn($q) => $q->with('customer:id,customer_name'),
            'pet' => fn($q) => $q->select('id', 'name'),
        ])
        ->where(function ($query) use ($user) {
            if ($user->role === 'customer') {
                $query->where('customer_id', $user->id);
            } else {
                $query->where('owner_id', $user->id);
            }
        })
        ->withCount(['messages' => fn($q) => $q->where('sender_id', '!=', $user->id)->where('is_read', false)])
        ->orderByDesc('last_message_at')
        ->get();

        return response()->json(['conversations' => $conversations]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'owner_id' => 'required|exists:users,id',
            'pet_id' => 'nullable|exists:pets,id',
        ]);

        if ($user->role === 'customer') {
            $conversation = Conversation::updateOrCreate(
                [
                    'customer_id' => $user->id,
                    'owner_id' => $validated['owner_id'],
                    'pet_id' => $validated['pet_id'],
                ],
                ['last_message_at' => now()]
            );
        } else {
            $conversation = Conversation::create([
                'customer_id' => $validated['owner_id'],
                'owner_id' => $user->id,
                'pet_id' => $validated['pet_id'] ?? null,
                'last_message_at' => now(),
            ]);
        }

        return response()->json(['conversation' => $conversation->load('pet')], 201);
    }

    public function messages(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where(function ($q) use ($user) {
            if ($user->role === 'customer') {
                $q->where('customer_id', $user->id);
            } else {
                $q->where('owner_id', $user->id);
            }
        })->findOrFail($conversationId);

          $messages = $conversation->messages()
            ->with('sender.customer:id,customer_name')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark as read
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['messages' => $messages]);
    }

    public function sendMessage(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::where(function ($q) use ($user) {
            if ($user->role === 'customer') {
                $q->where('customer_id', $user->id);
            } else {
                $q->where('owner_id', $user->id);
            }
        })->findOrFail($conversationId);

        $validated = $request->validate(['body' => 'required|string']);

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'body' => $validated['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json(['message' => $message->load('sender.customer:id,customer_name')], 201);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversationIds = Conversation::where(function ($q) use ($user) {
            if ($user->role === 'customer') {
                $q->where('customer_id', $user->id);
            } else {
                $q->where('owner_id', $user->id);
            }
        })->pluck('id');

        $count = Message::whereIn('conversation_id', $conversationIds)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}