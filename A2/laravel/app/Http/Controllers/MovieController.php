<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Models\Movie;


function callAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data) {
                $url = sprintf("%s?%s", $url, http_build_query($data));
            }
    }

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($curl);
    curl_close($curl);

    return $result;
}


class MovieController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function getMovies()
    {
        $movies = Movie::orderBy('id', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $movies]);
    }
    public function addMovie(StoreMovieRequest $request)
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

    public function updateMovie(UpdateMovieRequest $request, $id)
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


    public function searchMovie(request $request)
    {

        $apiKey = API_KEY;
        $url = API_URL . '?' . http_build_query([
            'apikey' => $apiKey,
            's' => $request->query('query'),
            'type' => 'movie'
        ]);

        $result = callAPI('GET', $url);
        return response()->json(['status' => 'success', 'data' =>$result]);
    }

}
