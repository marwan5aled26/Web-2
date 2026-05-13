<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Models\Movie;


class MovieController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function get_movies()
    {
        $movies = Movie::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $movies]);
    }

    public function store(StoreMovieRequest $request)
    {
        $validated = $request->validated();

        Movie::create([
            'id'     => $validated['id'],
            'title'  => $validated['title'],
            'year'   => $validated['year'] ?? 'No Year',
            'rating' => $validated['rating'] ?? 0,
            'note'   => $validated['note'] ?? '',
            'poster' => $validated['poster'] ?? 'https://via.placeholder.com/300x450?text=No+Poster',
        ]);
        return response()->json(['status' => 'success', 'data' => $validated]);
    }

    public function update(UpdateMovieRequest $request, $id)
    {
        $validated = $request->validated();

        $movie = Movie::findOrFail($id);
        $movie->update([
            'title'  => $validated['title'] ?? $movie->title,
            'year'   => $validated['year'] ?? $movie->year,
            'rating' => $validated['rating'] ?? $movie->rating,
            'note'   => $validated['note'] ?? $movie->note,
            'poster' => $validated['poster'] ?? $movie->poster,
        ]);
        return response()->json(['status' => 'success', 'data' => $validated]);
    }

    public function deleteMovie($id)
    {
        $movie = Movie::findOrFail($id);
        $movie->delete();
        return response()->json(['status' => 'success', 'message' => 'Movie deleted']);
    }

}
