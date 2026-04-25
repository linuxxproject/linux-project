<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/users', [AuthController::class, 'users']);

    // Missions
    Route::get('/missions', [MissionController::class, 'index']);
    Route::post('/missions', [MissionController::class, 'store']);
    Route::get('/missions/my', [MissionController::class, 'myMissions']);
    Route::get('/missions/{mission}', [MissionController::class, 'show']);
    Route::put('/missions/{mission}', [MissionController::class, 'update']);
    Route::delete('/missions/{mission}', [MissionController::class, 'destroy']);

    // Candidatures — /applications/mine doit être AVANT /applications/{application}
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/mine', [ApplicationController::class, 'mine']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::put('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy']);

    // Messagerie
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations', [MessageController::class, 'startConversation']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'sendMessage']);

    // Angular compatibility aliases
    Route::get('/messages', [MessageController::class, 'conversations']);
    Route::post('/messages', [MessageController::class, 'sendOrStart']);

    // Stats (admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('/stats/dashboard', [StatsController::class, 'dashboard']);
        Route::get('/stats/monthly', [StatsController::class, 'monthlyActivity']);
        Route::get('/stats/users', [StatsController::class, 'recentUsers']);
        Route::get('/stats', [StatsController::class, 'dashboard']);
    });
});
