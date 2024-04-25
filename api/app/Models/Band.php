<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Band extends Model
{
    use HasFactory;

    public function members()
    {
        return $this->belongsToMany(User::class, 'band_members', 'band_id', 'user_id');
    }

    public function shows()
    {
        return $this->hasMany(Show::class);
    }
}
