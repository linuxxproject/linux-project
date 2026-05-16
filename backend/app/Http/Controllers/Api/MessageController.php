<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function conversations()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Non authentifie.'], 401);
            }

            $conversations = $user
                ->conversations()
                ->with(['participants:id,name,email'])
                ->withCount('messages')
                ->latest('updated_at')
                ->get();

            $conversations->each(function ($conversation) {
                $conversation->last_message = $conversation->messages()->latest('created_at')->first();
                $conversation->unread_count = $conversation->messages()
                    ->where('sender_id', '!=', Auth::id())
                    ->where('is_read', false)
                    ->count();
                unset($conversation->messages);
            });

            return response()->json($conversations);
        } catch (\Exception $e) {
            Log::error('Erreur conversations: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur serveur.', 'error' => $e->getMessage()], 500);
        }
    }

    public function messages(Conversation $conversation)
    {
        try {
            if (!$conversation->participants->contains(Auth::id())) {
                return response()->json(['message' => 'Acces non autorise.'], 403);
            }

            $messages = $conversation->messages()
                ->with('sender:id,name')
                ->latest()
                ->paginate(50);

            $conversation->messages()
                ->where('sender_id', '!=', Auth::id())
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Erreur messages: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur serveur.'], 500);
        }
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        try {
            $authId = Auth::id();
            if (!$authId) {
                return response()->json(['message' => 'Non authentifie.'], 401);
            }

            $isParticipant = $conversation->participants()->where('user_id', $authId)->exists();
            if (!$isParticipant) {
                return response()->json(['message' => 'Acces non autorise. Vous n\'etes pas participant de cette conversation.'], 403);
            }

            $validated = $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $authId,
                'content' => $validated['content'],
                'is_read' => false,
            ]);

            $message->load('sender:id,name');
            $conversation->touch();

            return response()->json($message, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Donnees invalides.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur sendMessage: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur serveur.', 'error' => $e->getMessage()], 500);
        }
    }

    public function startConversation(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'message' => 'required|string|max:5000',
            ]);

            $authId = Auth::id();
            $recipientId = (int) $validated['user_id'];

            if ($authId === $recipientId) {
                return response()->json(['message' => 'Vous ne pouvez pas demarrer une conversation avec vous-meme.'], 422);
            }

            $existingConversation = Conversation::whereHas('participants', function ($query) use ($authId) {
                $query->where('user_id', $authId);
            })->whereHas('participants', function ($query) use ($recipientId) {
                $query->where('user_id', $recipientId);
            })->has('participants', '=', 2)->first();

            if ($existingConversation) {
                $message = Message::create([
                    'conversation_id' => $existingConversation->id,
                    'sender_id' => $authId,
                    'content' => $validated['message'],
                    'is_read' => false,
                ]);

                $existingConversation->touch();

                return response()->json([
                    'conversation' => $existingConversation->load('participants:id,name,email'),
                    'message' => $message->load('sender:id,name'),
                ], 201);
            }

            $conversation = DB::transaction(function () use ($authId, $recipientId, $validated) {
                $newConversation = Conversation::create();
                $newConversation->participants()->attach([$authId, $recipientId]);

                Message::create([
                    'conversation_id' => $newConversation->id,
                    'sender_id' => $authId,
                    'content' => $validated['message'],
                    'is_read' => false,
                ]);

                return $newConversation;
            });

            return response()->json(
                $conversation->load(['participants:id,name,email', 'messages.sender:id,name']),
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Donnees invalides.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur startConversation: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur serveur.', 'error' => $e->getMessage()], 500);
        }
    }

    public function sendOrStart(Request $request)
    {
        try {
            if ($request->has('conversation_id')) {
                $conversation = Conversation::findOrFail($request->conversation_id);

                if ($request->has('message')) {
                    $request->merge(['content' => $request->input('message')]);
                }

                return $this->sendMessage($request, $conversation);
            }

            if ($request->has('user_id') && $request->has('message')) {
                return $this->startConversation($request);
            }

            return response()->json([
                'message' => 'Parametres invalides. Necessite conversation_id ou (user_id + message).'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur sendOrStart: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur serveur.'], 500);
        }
    }
}
