<?php
header('Content-Type: application/json');

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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = trim($_POST['action']);

    if ($action === 'search') {
        $query = isset($_POST['query']) ? trim($_POST['query']) : '';

        if ($query === '') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Search query is required'
            ]);
            exit();
        }

        $apiKey = 'daeab9a1';
        $url = 'https://www.omdbapi.com/?' . http_build_query([
            'apikey' => $apiKey,
            's' => $query,
            'type' => 'movie'
        ]);

        $result = callAPI('GET', $url);

        if ($result === false || $result === null || $result === '') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Unable to reach OMDb API'
            ]);
            exit();
        }

        $data = json_decode($result, true);

        if (!is_array($data) || !isset($data['Response'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid response from OMDb API'
            ]);
            exit();
        }

        if ($data['Response'] === 'True') {

            $movies = [];

            foreach ($data['Search'] as $movie) {
                $detailsUrl = 'https://www.omdbapi.com/?' . http_build_query([
                    'apikey' => $apiKey,
                    'i' => $movie['imdbID']
                ]);

                $detailsResult = callAPI('GET', $detailsUrl);
                $detailed = null;

                if ($detailsResult !== false && $detailsResult !== null && $detailsResult !== '') {
                    $detailsData = json_decode($detailsResult, true);
                    if (is_array($detailsData) && isset($detailsData['Response']) && $detailsData['Response'] === 'True') {
                        $detailed = $detailsData;
                    }
                }

                $movies[] = [
                    'title' => $movie['Title'],
                    'year' => $movie['Year'],
                    'id' => $movie['imdbID'],
                    'type' => $movie['Type'],
                    'poster' => $movie['Poster'],
                    'detailed' => $detailed
                ];
            }

            echo json_encode([
                'status' => 'success',
                'movies' => $movies
            ]);

        } else {
            echo json_encode([
                'status' => 'error',
                'message' => isset($data['Error']) ? $data['Error'] : 'Movie not found'
            ]);
        }
        exit();
    }

    echo json_encode([
        'status' => 'error',
        'message' => 'Unknown action'
    ]);
    exit();
}

echo json_encode([
    'status' => 'error',
    'message' => 'Invalid request'
]);
exit();