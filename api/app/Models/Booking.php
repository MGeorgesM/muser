<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    public function show()
    {
        return $this->belongsTo(Show::class);
    }

    public function band()
    {
        return $this->belongsTo(Band::class);
    }

    public function venue()
    {
        return $this->belongsTo(User::class, 'venue_id');
    }
}
