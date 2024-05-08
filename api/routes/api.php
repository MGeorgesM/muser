<?php

use Illuminate\Support\Facades\Route;

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\VenueMiddleware;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AiMatchMakingController;
use App\Http\Middleware\AuthenticatedMiddleware;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::get('me', [AuthController::class, 'me']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::group(['prefix' => 'register'], function ($router) {

        Route::post('/', [AuthController::class, 'register']);
        Route::post('email', [AuthController::class, 'checkEmail']);
        Route::get('userinfo', [AuthController::class, 'getProperties']);

    });
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

    Route::group(['prefix' => 'venues'], function ($router) {

        Route::get('{venueId}/rating', [VenueController::class, 'getVenueAverageRating']);
        Route::post('{venueId}/rating', [VenueController::class, 'addUpdateRating']);
        
    });

    Route::group(['prefix' => 'users'], function ($router) {

        Route::get('{id?}', [UserController::class, 'getUser'])->where('id', '[0-9]+');
        Route::get('details', [UserController::class, 'getUsersPicturesAndNames']);
        Route::get('type/{role}', [UserController::class, 'getUsersByRole']);
        Route::post('{id}', [UserController::class, 'updateUser']);

    });

    Route::group(['prefix' => 'bands'], function ($router) {

        Route::get('me', [BandController::class, 'getUserBands']);
        Route::get('{id?}', [BandController::class, 'getBand']);
        Route::post('/', [BandController::class, 'addBand']);

    });

    Route::group(['prefix' => 'connections'], function ($router) {

        Route::get('/', [UserController::class, 'getConnections']);
        Route::post('/{id}', [UserController::class, 'addConnection']);

    });

    Route::group(['prefix' => 'shows'], function ($router) {

        Route::get('{showId?}', [ShowController::class, 'getShows']);
        Route::post('/', [ShowController::class, 'addShow']);

    });

    Route::group(['prefix' => 'ai'], function ($router) {

        Route::post('/', [AiMatchMakingController::class, 'getMatches']);
        Rout::post('/getGenre', [AiMatchMakingController::class, 'getGenre']);
        Route::post('/match', [AiMatchMakingController::class, 'matchUsers']);

    });

    Route::get('genres/', [GenreController::class, 'getGenres']);

});
