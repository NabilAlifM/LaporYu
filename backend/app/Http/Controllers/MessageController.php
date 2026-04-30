<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function index(Request $request)
    {
        $userId = auth()->id();

        $conversations = Conversation::where('participant_one_id', $userId)
            ->orWhere('participant_two_id', $userId)
            ->with(['messages' => function ($query) {
                $query->latest()->take(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conv) use ($userId) {
                // Determine the other participant
                $otherParticipantId = $conv->participant_one_id == $userId 
                    ? $conv->participant_two_id 
                    : $conv->participant_one_id;
                
                $otherParticipant = User::find($otherParticipantId);
                
                $lastMessage = $conv->messages->first();
                $unreadCount = Message::where('conversation_id', $conv->id)
                    ->where('sender_id', $otherParticipantId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'id' => $conv->id,
                    'contact_id' => $otherParticipant->id,
                    'name' => $otherParticipant->name,
                    'avatar' => $otherParticipant->avatar ?? 'https://i.pravatar.cc/150?u='.$otherParticipant->id,
                    'lastMessage' => $lastMessage ? $lastMessage->body : 'Mulai percakapan',
                    'time' => $lastMessage ? $lastMessage->created_at->format('H:i') : $conv->created_at->format('H:i'),
                    'unread' => $unreadCount,
                    'online' => false, // Can be improved with actual presence
                    'type' => $otherParticipant->role === 'instansi' ? 'instansi' : 'warga',
                ];
            })->keyBy('contact_id');

        // Append all instansi that the user hasn't chatted with
        $instansiUsers = User::where('role', 'instansi')->get();

        foreach ($instansiUsers as $instansi) {
            if (!$conversations->has($instansi->id)) {
                $conversations->put($instansi->id, [
                    'id' => 'new_' . $instansi->id,
                    'contact_id' => $instansi->id,
                    'name' => $instansi->name,
                    'avatar' => $instansi->avatar ?? 'https://i.pravatar.cc/150?u='.$instansi->id,
                    'lastMessage' => 'Tanyakan sesuatu kepada instansi...',
                    'time' => '',
                    'unread' => 0,
                    'online' => true,
                    'type' => 'instansi',
                ]);
            }
        }

        return response()->json($conversations->values());
    }

    /**
     * Get messages for a specific conversation (or create if not exists)
     */
    public function show($contactId)
    {
        $userId = auth()->id();

        // Find conversation
        $conversation = Conversation::where(function ($query) use ($userId, $contactId) {
            $query->where('participant_one_id', $userId)
                  ->where('participant_two_id', $contactId);
        })->orWhere(function ($query) use ($userId, $contactId) {
            $query->where('participant_one_id', $contactId)
                  ->where('participant_two_id', $userId);
        })->first();

        // If no conversation exists, create an empty structure
        if (!$conversation) {
            return response()->json([
                'conversation_id' => null,
                'messages' => []
            ]);
        }

        // Mark as read
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', $contactId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = $conversation->messages()->orderBy('created_at', 'asc')->get()->map(function ($msg) use ($userId) {
            return [
                'id' => $msg->id,
                'text' => $msg->body,
                'sender' => $msg->sender_id == $userId ? 'me' : 'them',
                'time' => $msg->created_at->format('H:i'),
                'type' => 'text'
            ];
        });

        return response()->json([
            'conversation_id' => $conversation->id,
            'messages' => $messages
        ]);
    }

    /**
     * Store a new message
     */
    public function store(Request $request, $contactId)
    {
        $request->validate([
            'text' => 'required|string',
        ]);

        $userId = auth()->id();

        // Find or create conversation
        $conversation = Conversation::where(function ($query) use ($userId, $contactId) {
            $query->where('participant_one_id', $userId)
                  ->where('participant_two_id', $contactId);
        })->orWhere(function ($query) use ($userId, $contactId) {
            $query->where('participant_one_id', $contactId)
                  ->where('participant_two_id', $userId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'participant_one_id' => $userId,
                'participant_two_id' => $contactId,
            ]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'body' => $request->text,
            'is_read' => false,
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'id' => $message->id,
            'text' => $message->body,
            'sender' => 'me',
            'time' => $message->created_at->format('H:i'),
            'type' => 'text'
        ], 201);
    }

    /**
     * Delete a message
     */
    public function destroy($messageId)
    {
        $message = Message::findOrFail($messageId);

        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }
}
