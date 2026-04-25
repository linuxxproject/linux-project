<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Mission::with('client:id,name,email');

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

        return response()->json($missions);
    }

    public function store(Request $request)
    {
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

        return response()->json($mission->load('client:id,name,email'), 201);
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

        return response()->json($mission);
    }

    public function update(Request $request, Mission $mission)
    {
        if ($mission->client_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'budget' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:ouverte,en_cours,fermee',
            'skills' => 'nullable|array',
            'deadline' => 'nullable|date',
        ]);

        $mission->update($validated);

        return response()->json($mission->load('client:id,name,email'));
    }

    public function destroy(Mission $mission)
    {
        if ($mission->client_id !== Auth::id() && !Auth::user()->isAdmin()) {
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
            ->get();

        return response()->json($missions);
    }
}

