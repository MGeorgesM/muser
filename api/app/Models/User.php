<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $hidden = [
        'password',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'about',
        'picture',
        'location_id',
        'availability_id',
        'experience_id',
        'instrument_id',
        'venue_name',
        'venue_type_id',
        'role_id',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user_id' => $this->id,
        ];
    }

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
        return $this->belongsTo(Instrument::class, 'instrument_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function availability()
    {
        return $this->belongsTo(Availability::class);
    }

    public function experience()
    {
        return $this->belongsTo(Experience::class);
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

    public function connectionsAsOne()
    {
        return $this->hasMany(Connection::class, 'user_one_id');
    }

    public function connectionsAsTwo()
    {
        return $this->hasMany(Connection::class, 'user_two_id');
    }

    public function getFullDetailsAttribute()
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'name' => $this->name,
            'email' => $this->email,
            'about' => $this->about,
            'picture' => $this->picture,
            'location' => $this->location,
            'genres' => $this->genres->pluck('name', 'id'),
            'instrument' => $this->instrument,
            'availability' => $this->availability,
            'experience' => $this->experience,
            'venueType' => $this->venueType,
            'venueName' => $this->venue_name,
        ];
    }
}
