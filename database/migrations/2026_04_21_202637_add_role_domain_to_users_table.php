<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['client', 'freelance', 'admin'])->default('client');
            $table->enum('domaine', [
                'Technologie & Informatique',
                'Design & Créativité',
                'Ingénierie & Architecture',
                'Finance & Comptabilité',
                'Business & Management',
                'Marketing & Communication',
                'Rédaction & Traduction',
                'Autre'
            ])->nullable();
            $table->boolean('actif')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'domaine', 'actif']);
        });
    }
};
