<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenuesRating extends Model
{
    use HasFactory;

    public function venue()
    {
        return $this->belongsTo(User::class, 'venue_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
