<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

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

        return response()->json($application, 201);
    }

    public function show(Application $application)
    {
        $user = Auth::user();

        $isAuthorized = $user->isAdmin()
            || $application->freelance_id === $user->id
            || ($application->mission && $application->mission->client_id === $user->id);

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
        $application->load('mission:id,client_id,status');

        if ($application->mission->client_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:en_attente,acceptee,refusee',
        ]);

        $application->update(['status' => $validated['status']]);

        if ($validated['status'] === 'acceptee') {
            $application->mission->update(['status' => 'en_cours']);
        }

        return response()->json($application->load(['mission:id,client_id,title,status', 'freelance:id,name']));
    }

    public function destroy(Application $application)
    {
        $application->load('mission:id,client_id');

        $user = Auth::user();

        $isAuthorized = $user->isAdmin()
            || $application->freelance_id === $user->id
            || $application->mission->client_id === $user->id;

        if (!$isAuthorized) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Candidature retirée']);
    }
}

