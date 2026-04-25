<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendCode']);
Route::post('/verify-code',     [PasswordResetController::class, 'verifyCode']);
Route::post('/reset-password',  [PasswordResetController::class, 'reset']);

Route::middleware(['auth:api'])->group(function () {
    Route::post('/logout',                 [AuthController::class, 'logout']);
    Route::get('/admin/stats',             [AdminController::class, 'stats']);
    Route::get('/admin/users',             [AdminController::class, 'users']);
    Route::put('/admin/users/{id}/toggle', [AdminController::class, 'toggleStatus']);
    Route::delete('/admin/users/{id}',     [AdminController::class, 'destroy']);
});
Route::post('/debug', function () {
    return response()->json(['ok' => true]);
});
