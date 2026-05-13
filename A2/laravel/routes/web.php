<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

Route::get('/', [Controller::class, 'index'])->name('home');
Route::post('/search-movie', [Controller::class, 'search'])->name('search');
Route::post('/add-movie', [Controller::class, 'add'])->name('add');
Route::get('/get-movies', [Controller::class, 'getMovies'])->name('get.movies');
Route::delete('/delete-movie/{id}', [Controller::class, 'delete'])->name('delete');
Route::put('/update-movie/{id}', [Controller::class, 'update'])->name('update');
Route::post('/upload-poster', [Controller::class, 'uploadPoster'])->name('upload.poster');