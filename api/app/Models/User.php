<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    protected $hidden = [
        'password',
    ];

    public function setPasswordAttribute($value)
    {
        return $this->attributes['password'] = bcrypt($value);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'musician_genres');
    }

    public function bands()
    {
        return $this->belongsToMany(Band::class, 'band_members', 'user_id', 'band_id');
    }

    public function bookingsAsVenue()
    {
        return $this->hasMany(Booking::class, 'venue_id');
    }

    public function ratings()
    {
        return $this->hasMany(VenueRating::class, 'venue_id');
    }
}
