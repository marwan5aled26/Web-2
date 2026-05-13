@extends('layouts.app')

@section('content')
    <section class="search-section">
        <div class="search-wrapper">
            <div class="search-bar">
                <span class="search-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </span>
                <input type="text" id="searchInput" placeholder="Search for a movie..." autocomplete="off" />
                <button id="searchBtn" onclick="searchMovie()">Search</button>
            </div>
            <p class="search-hint">Powered by OMDb API</p>
        </div>
    </section>

    <section class="results-section" id="resultsSection" style="display:none;">
        <div class="container">
            <h2 class="section-title">
                <span class="title-icon">🔍</span>
                Search Results
                <span class="results-count" id="resultsCount"></span>
            </h2>
            <div class="grid" id="results"></div>
        </div>
    </section>

    <section id="myListSection" class="mylist-section">
    <div class="container">
        <h2 class="section-title">
            <span class="title-icon">🎬</span>
            My Watchlist
            <span class="results-count" id="listCount"></span>
        </h2>
        <div class="grid" id="myList">
            <div class="empty-state" id="emptyState">
                <div class="empty-icon">🎞️</div>
                <p>Your watchlist is empty.<br>Search for a movie and add it!</p>
                </div>
            </div>
        </div>
    </section>

    @endsection