<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GenreController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthenticatedMiddleware;
use App\Http\Middleware\VenueMiddleware;
use App\Http\Controllers\AiMatchMakingController;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('register/email', [AuthController::class, 'checkEmail']);
    Route::get('register/userinfo', [AuthController::class, 'getProperties']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});

Route::middleware([AuthenticatedMiddleware::class])->group(function () {
    

    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::delete('users/{id?}', [UserController::class, 'disableUser']);
        Route::delete('bands/{id}', [BandController::class, 'deleteBand']);
        Route::delete('shows/{showId}', [ShowController::class, 'deleteShow']);
    });

    Route::middleware([VenueMiddleware::class])->group(function () {
        Route::put('shows', [ShowController::class, 'updateShow']);
    });

    Route::get('users/{id?}', [UserController::class, 'getUser'])->where('id', '[0-9]+');
    Route::get('users/details', [UserController::class, 'getUsersPicturesAndNames']);
    Route::get('users/type/{role}', [UserController::class, 'getUsersByRole']);
    Route::post('users/{id}', [UserController::class, 'updateUser']);

    Route::get('connections', [UserController::class, 'getConnections']);
    Route::post('connections/{id}', [UserController::class, 'addConnection']);

    Route::get('venues/{venueId}/rating', [VenueController::class, 'getVenueAverageRating']);
    Route::post('venues/{venueId}/rating', [VenueController::class, 'addUpdateRating']);

    Route::get('bands/me', [BandController::class, 'getUserBands']);
    Route::get('bands/{id?}', [BandController::class, 'getBand']);
    Route::post('bands', [BandController::class, 'addBand']);

    Route::get('shows/{showId?}', [ShowController::class, 'getShows']);
    Route::post('shows', [ShowController::class, 'addShow']);

    Route::get('genres/', [GenreController::class, 'getGenres']);


    Route::post('aimatch/', [AiMatchMakingController::class, 'getMatch']);
    // Route::get('venues/{venueId}/shows/{status?}', [VenueController::class, 'getShowsByVenue']);
    // Route::get('shows', [VenueController::class, 'getShowsByVenue']);
});
