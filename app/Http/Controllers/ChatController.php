<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Display a listing of conversations.
     */
    public function index()
    {
        $conversations = Auth::user()->conversations()
            ->with(['users', 'latestMessage'])
            ->orderByDesc('last_message_at')
            ->get();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations
        ]);
    }

    /**
     * Display the messages for a specific conversation.
     */
    public function show(Conversation $conversation)
    {
        // Ensure user belongs to conversation
        if (!$conversation->users()->where('user_id', Auth::id())->exists()) {
            abort(403);
        }

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Chat/Show', [
            'conversation' => $conversation->load('users'),
            'messages' => $messages
        ]);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request, Conversation $conversation)
    {
        // Ensure user belongs to conversation
        if (!$conversation->users()->where('user_id', Auth::id())->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => Auth::id(),
            'body' => $validated['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message->load('sender'));
    }

    /**
     * Start or find a conversation with another user.
     */
    public function start(User $user)
    {
        $currentUserId = Auth::id();
        $targetUserId = $user->id;

        // Try to find an existing single conversation between these two
        $conversation = Conversation::where('type', 'single')
            ->whereHas('users', function ($q) use ($currentUserId) {
                $q->where('user_id', $currentUserId);
            })
            ->whereHas('users', function ($q) use ($targetUserId) {
                $q->where('user_id', $targetUserId);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'type' => 'single',
                'last_message_at' => now(),
            ]);

            $conversation->users()->attach([$currentUserId, $targetUserId]);
        }

        return redirect()->route('chat.show', $conversation->id);
    }
}
