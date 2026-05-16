<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'users' => [
                'total' => User::count(),
                'clients' => User::where('role', 'client')->count(),
                'freelances' => User::where('role', 'freelance')->count(),
                'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
            ],
            'missions' => [
                'total' => Mission::count(),
                'open' => Mission::where('status', 'ouverte')->count(),
                'in_progress' => Mission::where('status', 'en_cours')->count(),
                'closed' => Mission::where('status', 'fermee')->count(),
            ],
            'applications' => [
                'total' => Application::count(),
                'pending' => Application::where('status', 'en_attente')->count(),
                'accepted' => Application::where('status', 'acceptee')->count(),
                'rejected' => Application::where('status', 'refusee')->count(),
            ],
        ]);
    }

    public function monthlyActivity()
    {
        $months = collect(range(0, 5))->map(function ($i) {
            $date = now()->subMonths($i);
            return [
                'month' => $date->format('M'),
                'missions' => Mission::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'applications' => Application::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
            ];
        })->reverse()->values();

        return response()->json($months);
    }

    public function recentUsers()
    {
        $users = User::latest()->take(10)->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']);

        return response()->json($users);
    }
}
