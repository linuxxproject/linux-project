<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'nom'      => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role'     => 'required|in:client,freelance',
            'domaine'  => 'required|string',
        ]);

        $user = User::create([
            'name'     => $request->nom,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => $request->role,
            'domaine'  => $request->domaine,
        ]);

        $token = auth('api')->login($user);
        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Identifiants incorrects'], 401);
        }

        return response()->json([
            'token' => $token,
            'role'  => auth('api')->user()->role
        ]);
    }

    public function logout() {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnecté']);
    }
}
