<!-- HTML HEAD & HEADER NAVIGATION -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
    <title>🎬 Movie Tracker</title>
    <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>
<body>

<header class="site-header">
    <div class="container header-inner">
        <div class="logo">
            <div class="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6H20V18H4V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M8 6V18" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 6V18" stroke="currentColor" stroke-width="2"/>
                    <path d="M4 10H8" stroke="currentColor" stroke-width="2"/>
                    <path d="M4 14H8" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 10H20" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 14H20" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <span class="logo-text">MovieTracker</span>
        </div>
        <nav class="header-nav">
            <button class="nav-watchlist-btn" onclick="scrollToWatchlist()">My Watchlist</button>
            <button class="nav-add-btn" onclick="openAddMovieModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Movie
            </button>
        </nav>
    </div>
</header>