<?php



header('Content-Type: application/json');

// 🔗 Database Connection
$host     = "localhost";
$username = "root";
$password = "";
$db_name  = "movie_app";

$conn = mysqli_connect($host, $username, $password, $db_name);

if (!$conn) {
    echo json_encode([
        "status"  => "error",
        "message" => "Connection failed: " . mysqli_connect_error()
    ]);
    exit();
}

if (!isset($_POST['action'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "No action provided"
    ]);
    exit();
}

$action = trim($_POST['action']);


// ============================================================
//  ADD MOVIE
// ============================================================
if ($action === 'add') {

    // --- Server-Side Validation ---
    $title  = isset($_POST['title'])  ? trim($_POST['title'])  : '';
    $year   = isset($_POST['year'])   ? trim($_POST['year'])   : '';
    $rating = isset($_POST['rating']) ? trim($_POST['rating']) : '';
    $note   = isset($_POST['note'])   ? trim($_POST['note'])   : '';
    $poster = isset($_POST['poster']) ? trim($_POST['poster']) : '';

    if (empty($title)) {
        echo json_encode(["status" => "error", "message" => "Title is required"]);
        exit();
    }

    if (empty($year) || !preg_match('/^\d{4}$/', $year)) {
        echo json_encode(["status" => "error", "message" => "Valid year is required (e.g. 2024)"]);
        exit();
    }

    if ($rating !== '' && ($rating < 0 || $rating > 10)) {
        echo json_encode(["status" => "error", "message" => "Rating must be between 0 and 10"]);
        exit();
    }

    $rating = ($rating === '') ? 0 : (float) $rating;

    // --- Insert ---
     $check = mysqli_prepare($conn, "SELECT id FROM movies WHERE title = ?");
   mysqli_stmt_bind_param($check, "s", $title);
   mysqli_stmt_execute($check);
   mysqli_stmt_store_result($check);

if (mysqli_stmt_num_rows($check) > 0) {
    echo json_encode(["status" => "error", "message" => "Movie already in watchlist!"]);
    mysqli_stmt_close($check);
    exit();
}
mysqli_stmt_close($check);

    $sql  = "INSERT INTO movies (title, year, rating, note, poster) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ssdss", $title, $year, $rating, $note, $poster);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Movie added successfully",
            "id" => mysqli_insert_id($conn)
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}


// ============================================================
//  GET MOVIES
// ============================================================
if ($action === 'get') {

    $sql    = "SELECT * FROM movies ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
        exit();
    }

    $movies = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Escape output to prevent XSS
        $movies[] = [
            "id"     => $row['id'],
            "title"  => htmlspecialchars($row['title'],  ENT_QUOTES, 'UTF-8'),
            "year"   => htmlspecialchars($row['year'],   ENT_QUOTES, 'UTF-8'),
            "rating" => $row['rating'],
            "note"   => htmlspecialchars($row['note'],   ENT_QUOTES, 'UTF-8'),
            "poster" => htmlspecialchars($row['poster'], ENT_QUOTES, 'UTF-8'),
        ];
    }

    echo json_encode(["status" => "success", "data" => $movies]);
    exit();
}


// ============================================================
//  DELETE MOVIE
// ============================================================
if ($action === 'delete') {

    $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;

    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid movie ID"]);
        exit();
    }

    $sql  = "DELETE FROM movies WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["status" => "success", "message" => "Movie deleted"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}


// ============================================================
// UPDATE MOVIE (rating + note only)
// ============================================================
if ($action === 'update') {

    $id     = isset($_POST['id'])     ? (int)   $_POST['id']       : 0;
    $rating = isset($_POST['rating']) ? (float) $_POST['rating']   : 0;
    $note   = isset($_POST['note'])   ? trim($_POST['note'])        : '';

    // --- Validation ---
    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid movie ID"]);
        exit();
    }

    if ($rating < 0 || $rating > 10) {
        echo json_encode(["status" => "error", "message" => "Rating must be between 0 and 10"]);
        exit();
    }

    // --- Update ---
    // UPDATE بس rating و note
    $sql = "UPDATE movies SET rating = ?, note = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "dsi", $rating, $note, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["status" => "success", "message" => "Movie updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}


// ============================================================
// Unknown Action
// ============================================================
echo json_encode(["status" => "error", "message" => "Unknown action"]);
exit();
?>
