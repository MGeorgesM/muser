<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MusicianGenre extends Model
{
    use HasFactory;
    
    public $timestamps = false;

    protected $fillable = [
        'musician_id',
        'genre_id'
    ];
}
