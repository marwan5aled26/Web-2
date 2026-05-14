<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MovieController;

Route::get('/resources/css/{filename}', function ($filename) {
    $path = resource_path('css/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }
    return response(File::get($path), 200)->header('Content-Type', 'text/css');
});

Route::get('/resources/js/{filename}', function ($filename) {
    $path = resource_path('js/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }
    return response(File::get($path), 200)->header('Content-Type', 'application/javascript');
});

Route::get('/', [MovieController::class, 'index']);
Route::get('/get-movies', [MovieController::class, 'getMovies']);
Route::post('/add-movie', [MovieController::class, 'addMovie']);
Route::put('/update-movie/{id}', [MovieController::class, 'updateMovie']);
Route::delete('/delete-movie/{id}', [MovieController::class, 'deleteMovie']);
Route::post('/upload-poster', [MovieController::class, 'uploadPoster']);
Route::get('/searchMovie', [MovieController::class, 'searchMovie']);