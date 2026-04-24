<?php
header('Content-Type: application/json');

/* DATABASE CONNECTION */

$host = "localhost";
$username = "root";
$password = "";
$db_name = "movie_app";

$conn = mysqli_connect($host, $username, $password, $db_name);

if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Connection failed: " . mysqli_connect_error()
    ]);
    exit();
}

if (!isset($_POST['action'])) {
    echo json_encode([
        "status" => "error",
        "message" => "No action provided"
    ]);
    exit();
}

$action = trim($_POST['action']);

/* ADD MOVIE */

if ($action === 'add') {
    $id = isset($_POST['id']) ? trim($_POST['id']) : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $year = isset($_POST['year']) ? trim($_POST['year']) : '';
    $rating = isset($_POST['rating']) ? trim($_POST['rating']) : '';
    $note = isset($_POST['note']) ? trim($_POST['note']) : '';
    $poster = isset($_POST['poster']) ? trim($_POST['poster']) : '';

    if (empty($id)) {
        echo json_encode(["status" => "error", "message" => "ID is required"]);
        exit();
    }

    if (!preg_match('/^[0-9]+$/', $id) && !preg_match('/^tt[0-9]+$/', $id)) {
        echo json_encode(["status" => "error", "message" => "ID must contain only numbers or start with 'tt'"]);
        exit();
    }

    if (empty($title)) {
        echo json_encode(["status" => "error", "message" => "Title is required"]);
        exit();
    }

    if (empty($year) || !preg_match('/^\d{4}$/', $year)) {
        echo json_encode(["status" => "error", "message" => "Valid year is required (e.g., 2006)"]);
        exit();
    }

    $currentYear = date('Y');
    if ($year < 1900 || $year > 2026) {
        echo json_encode(["status" => "error", "message" => "Year must be between 1900 and 2026"]);
        exit();
    }

    if ($rating !== '' && ($rating < 0 || $rating > 10)) {
        echo json_encode(["status" => "error", "message" => "Rating must be between 0 and 10"]);
        exit();
    }

    $rating = ($rating === '') ? 0 : (float) $rating;

    if (empty($poster)) {
        $poster = 'https://via.placeholder.com/300x450?text=No+Poster';
    }

    $check = mysqli_prepare($conn, "SELECT id FROM movies WHERE id = ?");
    mysqli_stmt_bind_param($check, "s", $id);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);

    if (mysqli_stmt_num_rows($check) > 0) {
        echo json_encode(["status" => "error", "message" => "Movie ID already exists in watchlist!"]);
        mysqli_stmt_close($check);
        exit();
    }
    mysqli_stmt_close($check);

    $sql = "INSERT INTO movies (id, title, year, rating, note, poster) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssdss", $id, $title, $year, $rating, $note, $poster);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Movie added successfully",
            "id" => $id
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}

/* GET MOVIES */

if ($action === 'get') {
    $sql = "SELECT * FROM movies ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
        exit();
    }

    $movies = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $movies[] = [
            "id" => $row['id'],
            "title" => htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8'),
            "year" => htmlspecialchars($row['year'], ENT_QUOTES, 'UTF-8'),
            "rating" => $row['rating'],
            "note" => htmlspecialchars($row['note'], ENT_QUOTES, 'UTF-8'),
            "poster" => htmlspecialchars($row['poster'], ENT_QUOTES, 'UTF-8'),
        ];
    }

    echo json_encode(["status" => "success", "data" => $movies]);
    exit();
}

/* DELETE MOVIE */

if ($action === 'delete') {
    $id = isset($_POST['id']) ? trim($_POST['id']) : '';

    if ($id === '') {
        echo json_encode(["status" => "error", "message" => "Invalid movie ID"]);
        exit();
    }

    $sql = "DELETE FROM movies WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $id);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            echo json_encode(["status" => "success", "message" => "Movie deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Movie not found"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
    exit();
}

/* UPDATE MOVIE */

if ($action === 'update') {
    $id = isset($_POST['id']) ? trim($_POST['id']) : '';
    $rating = isset($_POST['rating']) ? (float) $_POST['rating'] : 0;
    $note = isset($_POST['note']) ? trim($_POST['note']) : '';

    if ($id === '') {
        echo json_encode(["status" => "error", "message" => "Invalid movie ID"]);
        exit();
    }

    if ($rating < 0 || $rating > 10) {
        echo json_encode(["status" => "error", "message" => "Rating must be between 0 and 10"]);
        exit();
    }

    $sql = "UPDATE movies SET rating = ?, note = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "dss", $rating, $note, $id);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            echo json_encode(["status" => "success", "message" => "Movie updated"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Movie not found or no changes made"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}

echo json_encode(["status" => "error", "message" => "Unknown action"]);
exit();
?>