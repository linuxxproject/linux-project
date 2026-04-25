<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'freelance_id',
        'status',
        'message',
        'proposed_budget',
    ];

    protected function casts(): array
    {
        return [
            'proposed_budget' => 'decimal:2',
        ];
    }

    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }

    public function freelance()
    {
        return $this->belongsTo(User::class, 'freelance_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'en_attente');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'acceptee');
    }
}

