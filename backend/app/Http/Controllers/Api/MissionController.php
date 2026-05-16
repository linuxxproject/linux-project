<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Mission::with('client:id,name,email')->withCount('applications');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $missions = $query->latest()->paginate(10);
        $missions->getCollection()->transform(fn ($mission) => $this->formatMission($mission));

        return response()->json($missions);
    }

    public function store(Request $request)
    {
        $this->normalizeMissionRequest($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
            'deadline' => 'nullable|date',
        ]);

        $mission = Mission::create([
            ...$validated,
            'client_id' => Auth::id(),
            'status' => 'ouverte',
        ]);

        return response()->json($this->formatMission($mission->load('client:id,name,email')), 201);
    }

    public function show(Mission $mission)
    {
        $mission->load([
            'client:id,name,email',
            'applications' => function ($query) {
                $query->with('freelance:id,name,email')
                      ->latest();
            }
        ]);

        return response()->json($this->formatMission($mission));
    }

    public function update(Request $request, Mission $mission)
    {
        if (!$this->canManageMission($mission)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $this->normalizeMissionRequest($request);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'budget' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:ouverte,en_cours,fermee',
            'skills' => 'nullable|array',
            'deadline' => 'nullable|date',
        ]);

        $mission->update($validated);

        return response()->json($this->formatMission($mission->load('client:id,name,email')));
    }

    public function destroy(Mission $mission)
    {
        if (!$this->canManageMission($mission)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $mission->delete();

        return response()->json(['message' => 'Mission supprimée']);
    }

    public function myMissions()
    {
        $missions = Mission::where('client_id', Auth::id())
            ->withCount('applications')
            ->latest()
            ->get()
            ->map(fn ($mission) => $this->formatMission($mission));

        return response()->json($missions);
    }

    public function candidatures(Mission $mission)
    {
        if (!$this->canManageMission($mission)) {
            return response()->json(['message' => 'Non autorise.'], 403);
        }

        $applications = $mission->applications()
            ->with('freelance:id,name,email')
            ->latest()
            ->get();

        return response()->json($applications);
    }

    private function canManageMission(Mission $mission): bool
    {
        $user = Auth::user();

        return $user instanceof User
            && ($mission->client_id === $user->id || $user->isAdmin());
    }

    private function normalizeMissionRequest(Request $request): void
    {
        $aliases = [
            'titre' => 'title',
            'date_echeance' => 'deadline',
            'statut' => 'status',
        ];

        $normalized = [];

        foreach ($aliases as $from => $to) {
            if ($request->has($from) && !$request->has($to)) {
                $normalized[$to] = $request->input($from);
            }
        }

        if ($request->has('categorie') && !$request->has('skills')) {
            $normalized['skills'] = [$request->input('categorie')];
        }

        if (($normalized['status'] ?? null) === 'terminee') {
            $normalized['status'] = 'fermee';
        }

        if (($normalized['status'] ?? null) === 'annulee') {
            $normalized['status'] = 'fermee';
        }

        if ($normalized !== []) {
            $request->merge($normalized);
        }
    }

    private function formatMission(Mission $mission): Mission
    {
        $category = is_array($mission->skills) ? ($mission->skills[0] ?? null) : null;

        $mission->setAttribute('titre', $mission->title);
        $mission->setAttribute('statut', $mission->status);
        $mission->setAttribute('date_echeance', optional($mission->deadline)->toDateString());
        $mission->setAttribute('categorie', $category);
        $mission->setAttribute('candidatures_count', $mission->applications_count ?? $mission->applications()->count());

        return $mission;
    }
}
