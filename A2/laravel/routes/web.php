<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

Route::get('/', [Controller::class, 'index']);
Route::post('/search-movie', [Controller::class, 'search']);
Route::post('/add-movie', [Controller::class, 'add']);
Route::get('/get-movies', [Controller::class, 'getMovies']);
Route::delete('/delete-movie/{id}', [Controller::class, 'delete']);
Route::put('/update-movie/{id}', [Controller::class, 'update']);
Route::post('/upload-poster', [Controller::class, 'uploadPoster']);