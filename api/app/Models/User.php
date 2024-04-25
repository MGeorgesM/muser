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

    public function bands()
    {
        return $this->belongsToMany(Band::class, 'band_members');
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'musician_genres', 'musician_id', 'genre_id');
    }

    public function instrument()
    {
        return $this->belongsTo(Instrument::class);
    }

    public function venueType()
    {
        return $this->belongsTo(VenueType::class);
    }

    public function shows()
    {
        return $this->hasMany(Show::class, 'venue_id');
    }

    public function givenRatings()
    {
        return $this->hasMany(VenuesRating::class, 'user_id');
    }

    public function receivedRatings()
    {
        return $this->hasMany(VenuesRating::class, 'venue_id');
    }

    // public function getFullDetailsAttribute()
    // {
    //     return [
    //         'role' => $this->role,
    //         'bands' => $this->bands,
    //         'genres' => $this->genres,
    //         'instrument' => $this->instrument,
    //         'venueType' => $this->venueType,
    //     ];
    // }
}
