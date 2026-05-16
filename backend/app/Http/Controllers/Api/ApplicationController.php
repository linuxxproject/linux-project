<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user instanceof User) {
            return response()->json(['message' => 'Non authentifie.'], 401);
        }

        if ($user->isClient()) {
            $applications = Application::whereHas('mission', function ($q) use ($user) {
                $q->where('client_id', $user->id);
            })
            ->with(['mission', 'freelance:id,name,email'])
            ->latest()
            ->get();
        } else {
            $applications = Application::where('freelance_id', $user->id)
                ->with(['mission' => function ($query) {
                    $query->select('id', 'client_id', 'title', 'status', 'budget')
                          ->with('client:id,name');
                }, 'freelance:id,name'])
                ->latest()
                ->get();
        }

        return response()->json($applications);
    }

    public function mine(Request $request)
    {
        return $this->index($request);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mission_id' => 'required|exists:missions,id',
            'message' => 'nullable|string',
            'proposed_budget' => 'nullable|numeric|min:0',
        ]);

        $mission = Mission::findOrFail($validated['mission_id']);

        if ($mission->status !== 'ouverte') {
            return response()->json(['message' => 'Cette mission n\'accepte plus de candidatures.'], 422);
        }

        $existing = Application::where('mission_id', $validated['mission_id'])
            ->where('freelance_id', Auth::id())
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette mission.'], 422);
        }

        $application = Application::create([
            ...$validated,
            'freelance_id' => Auth::id(),
            'status' => 'en_attente',
        ]);

        $application->load('freelance:id,name', 'mission:id,client_id,title');

        $this->sendApplicationMessage(
            Auth::id(),
            $mission->client_id,
            "Nouvelle candidature pour la mission \"{$mission->title}\".\n\n"
            . "Freelance: {$application->freelance->name}\n"
            . "Message: " . ($application->message ?: 'Le freelance a postulé sans message.')
        );

        return response()->json($application, 201);
    }

    public function show(Application $application)
    {
        $user = Auth::user();

        $isAuthorized = $user instanceof User
            && ($user->isAdmin()
            || $application->freelance_id === $user->id
            || ($application->mission && $application->mission->client_id === $user->id));

        if (!$isAuthorized) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return response()->json($application->load([
            'mission' => function ($query) {
                $query->select('id', 'client_id', 'title', 'description', 'status', 'budget', 'deadline')
                      ->with('client:id,name,email');
            },
            'freelance:id,name,email'
        ]));
    }

    public function updateStatus(Request $request, Application $application)
    {
        $application->load('mission:id,client_id,title,status', 'freelance:id,name');

        if (!$this->canManageApplicationMission($application)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:en_attente,acceptee,refusee',
        ]);

        $application->update(['status' => $validated['status']]);

        if ($validated['status'] === 'acceptee') {
            $application->mission->update(['status' => 'en_cours']);
        }

        if (in_array($validated['status'], ['acceptee', 'refusee'], true)) {
            $content = $validated['status'] === 'acceptee'
                ? "Bonne nouvelle, votre candidature pour la mission \"{$application->mission->title}\" a été acceptée. Le client va vous contacter pour la suite."
                : "Votre candidature pour la mission \"{$application->mission->title}\" a été refusée. Merci pour votre intérêt.";

            $this->sendApplicationMessage(Auth::id(), $application->freelance_id, $content);
        }

        return response()->json($application->load(['mission:id,client_id,title,status', 'freelance:id,name']));
    }

    public function complete(Application $application)
    {
        $application->load('mission:id,client_id,title,status', 'freelance:id,name');

        if ($application->freelance_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorise.'], 403);
        }

        if ($application->status !== 'acceptee') {
            return response()->json(['message' => 'Seule une candidature acceptee peut etre terminee.'], 422);
        }

        if ($application->mission->status === 'fermee') {
            return response()->json(['message' => 'Cette mission est deja terminee.'], 422);
        }

        $application->mission->update(['status' => 'fermee']);

        $this->sendApplicationMessage(
            Auth::id(),
            $application->mission->client_id,
            "Projet termine.\n\n"
            . "Le freelance {$application->freelance->name} a marque la mission \"{$application->mission->title}\" comme terminee. "
            . "Vous pouvez verifier le travail et le contacter si besoin."
        );

        return response()->json([
            'message' => 'Mission terminee. Un message a ete envoye au client.',
            'application' => $application->load(['mission:id,client_id,title,status', 'freelance:id,name']),
        ]);
    }

    public function destroy(Application $application)
    {
        $application->load('mission:id,client_id');

        $user = Auth::user();

        $isAuthorized = $user instanceof User
            && ($user->isAdmin()
            || $application->freelance_id === $user->id
            || $application->mission->client_id === $user->id);

        if (!$isAuthorized) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Candidature retirée']);
    }

    private function canManageApplicationMission(Application $application): bool
    {
        $user = Auth::user();

        return $user instanceof User
            && ($application->mission->client_id === $user->id || $user->isAdmin());
    }

    private function sendApplicationMessage(int $senderId, int $recipientId, string $content): void
    {
        if ($senderId === $recipientId) {
            return;
        }

        DB::transaction(function () use ($senderId, $recipientId, $content) {
            $conversation = Conversation::whereHas('participants', function ($query) use ($senderId) {
                $query->where('user_id', $senderId);
            })
                ->whereHas('participants', function ($query) use ($recipientId) {
                    $query->where('user_id', $recipientId);
                })
                ->has('participants', '=', 2)
                ->first();

            if (!$conversation) {
                $conversation = Conversation::create();
                $conversation->participants()->attach([$senderId, $recipientId]);
            }

            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $senderId,
                'content' => $content,
                'is_read' => false,
            ]);

            $conversation->touch();
        });
    }
}
