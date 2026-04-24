<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
class PasswordResetController extends Controller
{
    public function sendCode(Request $request) {
        $request->validate(['email' => 'required|email|exists:users']);
        $code = rand(100000, 999999);
        Cache::put('reset_' . $request->email, $code, 480);
        return response()->json(['message' => 'Code envoyé', 'code_test' => $code]);
    }
    public function verifyCode(Request $request) {
        $request->validate(['email' => 'required|email', 'code' => 'required']);
        $storedCode = Cache::get('reset_' . $request->email);
        if ($storedCode != $request->code) {
            return response()->json(['error' => 'Code invalide'], 400);
        }
        return response()->json(['message' => 'Code valide']);
    }
    public function reset(Request $request) {
        $request->validate(['email' => 'required|email|exists:users', 'code' => 'required', 'password' => 'required|min:8|confirmed']);
        $storedCode = Cache::get('reset_' . $request->email);
        if ($storedCode != $request->code) {
            return response()->json(['error' => 'Code invalide'], 400);
        }
        User::where('email', $request->email)->update(['password' => bcrypt($request->password)]);
        Cache::forget('reset_' . $request->email);
        return response()->json(['message' => 'Mot de passe modifié']);
    }
}
