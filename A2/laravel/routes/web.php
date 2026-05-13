<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MovieController;

Route::get('/', [MovieController::class, 'index'])->name('home');
Route::post('/search-movie', [MovieController::class, 'search'])->name('search');
Route::post('/add-movie', [MovieController::class, 'add'])->name('add');
Route::get('/get-movies', [MovieController::class, 'getMovies'])->name('get.movies');
Route::delete('/delete-movie/{id}', [MovieController::class, 'delete'])->name('delete');
Route::put('/update-movie/{id}', [MovieController::class, 'update'])->name('update');
Route::post('/upload-poster', [MovieController::class, 'uploadPoster'])->name('upload.poster');