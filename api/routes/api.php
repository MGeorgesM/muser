<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthenticatedMiddleware;
use App\Http\Middleware\VenueMiddleware;




    Route::group([

        'middleware' => 'api',
        'prefix' => 'auth'

    ], function ($router) {

        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('register', [AuthController::class, 'register']);

        Route::get('properties', [AuthController::class, 'getProperties']);
    });


    Route::middleware([AuthenticatedMiddleware::class])->group(function () {

        Route::middleware([AdminMiddleware::class])->group(function () {
            Route::delete('/users/{id}', [UserController::class, 'disableUser']);
            Route::delete('/bands/{id}', [BandController::class, 'deleteBand']);
            Route::delete('/shows/{showId}', [ShowController::class, 'deleteShow']);
        });

        Route::middleware([VenueMiddleware::class])->group(function () {
            Route::put('/shows', [ShowController::class, 'updateShow']);
        });

        Route::get('/users/{id}', [UserController::class, 'getUser']);
        Route::get('/users/type/{role}', [UserController::class, 'getUsersByRole']);
        Route::put('/users/{id}', [UserController::class, 'updateUser']);

        Route::get('/venues/{venueId}/shows/{status?}', [VenueController::class, 'getShowsByVenue']);
        Route::post('/venues/{venueId}/rating', [VenueController::class, 'addUpdateRating']);
        Route::get('/venues/{venueId}/rating', [VenueController::class, 'getVenueAverageRating']);

        Route::post('/bands', [BandController::class, 'addBand']);
        Route::get('/bands/{id?}', [BandController::class, 'getBand']);

        Route::post('/shows', [ShowController::class, 'addShow']);
        Route::get('/shows/{showId?}', [ShowController::class, 'getShow']);
    });

