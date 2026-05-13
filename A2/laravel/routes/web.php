<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MovieController;

Route::get('/',[MovieController::class, 'index']);
Route::get('/movies', [MovieController::class, 'getMovies']);
Route::post('/movies', [MovieController::class, 'addMovie']);
Route::put('/movies/{id}', [MovieController::class, 'updateMovie']);
Route::delete('/movies/{id}', [MovieController::class, 'deleteMovie']);
Route::post('/search-movie', [Controller::class, 'search']);
Route::post('/upload-poster', [Controller::class, 'uploadPoster']);