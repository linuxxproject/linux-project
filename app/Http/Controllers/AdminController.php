<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Mission;
use Illuminate\Http\Request;
class AdminController extends Controller
{
    public function stats() {
        return response()->json([
            'users'      => User::count(),
            'missions'   => Mission::count(),
            'clients'    => User::where('role', 'client')->count(),
            'freelances' => User::where('role', 'freelance')->count(),
        ]);
    }
    public function users() {
        return response()->json(User::all());
    }
    public function toggleStatus($id) {
        $user = User::findOrFail($id);
        $user->actif = !$user->actif;
        $user->save();
        return response()->json(['message' => 'Statut modifié', 'actif' => $user->actif]);
    }
    public function destroy($id) {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
