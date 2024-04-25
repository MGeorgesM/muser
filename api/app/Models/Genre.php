<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    public $timestamps = false;  

    public function musicians()
    {
        return $this->belongsToMany(User::class, 'musician_genres');
    }
}
