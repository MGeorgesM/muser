<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\UserController;


Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('register', [AuthController::class, 'register']);
});

Route::get('/users/{id}', [UserController::class, 'getUser']);
Route::get('/users/type/{role}', [UserController::class, 'getUsersByRole']);
Route::put('/users/{id}', [UserController::class, 'updateUser']);
Route::delete('/users/{id}', [UserController::class, 'disableUser']);

Route::get('/venues/{venueId}/shows/{status?}', [VenueController::class, 'getShowsByVenue']);

Route::post('/bands', [BandController::class, 'addBand']);
Route::get('/bands/{id}/members', [BandController::class, 'getBandMembers']);
Route::delete('/bands/{id}', [BandController::class, 'deleteBand']);

Route::post('/shows', [ShowController::class, 'store']);
Route::get('/shows/{showId?}', [ShowController::class, 'getShow']);
Route::delete('/shows', [ShowController::class, 'deleteShow']);