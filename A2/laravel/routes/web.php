<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MovieController;

Route::get('/', [MovieController::class, 'index']);
Route::get('/get-movies', [MovieController::class, 'getMovies']);
Route::post('/add-movie', [MovieController::class, 'addMovie']);
Route::put('/update-movie/{id}', [MovieController::class, 'updateMovie']);
Route::delete('/delete-movie/{id}', [MovieController::class, 'deleteMovie']);
Route::post('/search-movie', [Controller::class, 'search']);
Route::post('/upload-poster', [Controller::class, 'uploadPoster']);