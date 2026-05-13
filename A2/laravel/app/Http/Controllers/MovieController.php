<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MovieController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ]);
        }

        $apiKey = env('OMDB_API_KEY');
        $query = $request->query;

        $response = Http::get("https://www.omdbapi.com/", [
            'apikey' => $apiKey,
            's' => $query,
            'type' => 'movie'
        ]);

        if ($response->failed()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unable to reach OMDb API'
            ]);
        }

        $data = $response->json();

        if ($data['Response'] === 'True') {
            $movies = [];
            foreach ($data['Search'] as $movie) {
                // جلب التفاصيل لكل فيلم
                $details = Http::get("https://www.omdbapi.com/", [
                    'apikey' => $apiKey,
                    'i' => $movie['imdbID']
                ])->json();

                $movies[] = [
                    'title' => $movie['Title'],
                    'year' => $movie['Year'],
                    'id' => $movie['imdbID'],
                    'poster' => $movie['Poster'],
                    'detailed' => $details['Response'] === 'True' ? $details : null
                ];
            }

            return response()->json([
                'status' => 'success',
                'movies' => $movies
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => $data['Error'] ?? 'Movie not found'
        ]);
    }
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:movies,id',
            'title' => 'required|string|max:255',
            'year' => 'nullable|digits:4|min:1900|max:2026',
            'rating' => 'nullable|numeric|min:0|max:10',
            'note' => 'nullable|string|max:500',
            'poster' => 'nullable|url'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ]);
        }

        $movie = Movie::create([
            'id' => $request->id,
            'title' => $request->title,
            'year' => $request->year ?? 'No Year',
            'rating' => $request->rating ?? 0,
            'note' => $request->note,
            'poster' => $request->poster ?? 'https://via.placeholder.com/300x450?text=No+Poster'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Movie added successfully',
            'id' => $movie->id
        ]);
    }

    public function getMovies()
    {
        $movies = Movie::orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $movies
        ]);
    }

    public function delete($id)
    {
        $movie = Movie::find($id);
        if (!$movie) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movie not found'
            ]);
        }

        $movie->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Movie deleted'
        ]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|numeric|min:0|max:10',
            'note' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ]);
        }

        $movie = Movie::find($id);
        if (!$movie) {
            return response()->json([
                'status' => 'error',
                'message' => 'Movie not found'
            ]);
        }

        $movie->update([
            'rating' => $request->rating,
            'note' => $request->note
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Movie updated'
        ]);
    }
    public function uploadPoster(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'poster_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ]);
        }

        $path = $request->file('poster_file')->store('posters', 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'filepath' => $url
        ]);
    }
}