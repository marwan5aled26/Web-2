let globalMoviesData = [];

function togglePlot(movieId, button) {
    const plot = document.getElementById(`plot-${movieId}`);
    if (plot.style.webkitLineClamp === "unset") {
        plot.style.webkitLineClamp = "2";
        button.innerText = "Show More";
    } else {
        plot.style.webkitLineClamp = "unset";
        button.innerText = "Show Less";
    }
}

function scrollToWatchlist() {
    const section = document.getElementById("myListSection");
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function closeOverlay(event) {
    if (event.target === event.currentTarget) {
        event.currentTarget.classList.add('hidden');
    }
}

function searchMovie() {
    window.location.hash = "";
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim();
    const results = document.getElementById("results");
    const resultsSection = document.getElementById("resultsSection");

    if (query === "") {
        alert("Please enter a movie title to search.");
        return;
    }

    resultsSection.style.display = "block";
    results.innerHTML = `<div class="loading"><div class="loading-spinner"></div><p class="loading-text">Searching the archives...</p></div>`;

    $.ajax({
        url: "API_Ops.php",
        method: "POST",
        dataType: "json",
        data: { 
            action: "search",
            query: query 
        },
        success: function (searchData) {
            if (searchData.status === "success") {
                globalMoviesData = searchData.movies;

                $.ajax({
                    url: "DB_Ops.php",
                    method: "POST",
                    dataType: "json",
                    data: { action: "get" },
                    success: function (watchlistData) {
                        const watchlistIds = watchlistData.status === "success" ? watchlistData.data.map(m => m.id) : [];
                        let resultsHTML = "";

                        searchData.movies.forEach((movie) => {
                            let poster = movie.poster === "N/A" || !movie.poster ? "https://via.placeholder.com/300x450?text=No+Image" : movie.poster;
                            const imdbRating = movie.detailed ? movie.detailed.imdbRating : "N/A";
                            const plot = movie.detailed ? movie.detailed.Plot : "No plot available.";

                            const isAdded = watchlistIds.includes(movie.id);
                            const btnText = isAdded ? "✓ Added" : "Add to Watchlist";
                            const btnClass = isAdded ? "btn btn-add is-added" : "btn btn-add";
                            const btnDisabled = isAdded ? "disabled" : "";

                            resultsHTML += `<div class="card">
                                <div class="card-poster-wrap" onclick="showMovieDetails('${movie.id}')" style="cursor:pointer">
                                    <img src="${poster}" alt="${movie.title}" class="card-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                                    ${imdbRating !== "N/A" ? `<div class="poster-score"><span class="score-star">★</span><span>${imdbRating}</span></div>` : ""}
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title">${movie.title}</h3>
                                    <div class="card-meta"><span class="movie-year">${movie.year}</span></div>
                                    <div class="genre-tags">
                                        ${movie.detailed && movie.detailed.Genre ? movie.detailed.Genre.split(",").slice(0,3).map((genre) => `<span class="genre-tag">${genre.trim()}</span>`).join("") : `<span class="genre-tag">Unknown</span>`}
                                    </div>
                                    <p class="card-note" id="plot-${movie.id}">${plot}</p>
                                    ${plot.length > 120 ? `<button class="show-more-btn" onclick="togglePlot('${movie.id}', this)">Show More</button>` : ""}
                                </div>
                                <div class="card-actions">
                                    <button class="${btnClass}" id="btn-${movie.id}" onclick="addToWatchlist('${movie.id}')" ${btnDisabled}>${btnText}</button>
                                </div>
                            </div>`;
                        });

                        results.innerHTML = resultsHTML;
                        sessionStorage.setItem("lastResults", resultsHTML);
                        sessionStorage.setItem("lastMoviesData", JSON.stringify(globalMoviesData));
                        sessionStorage.setItem("lastQuery", query);
                    },
                    error: function (xhr, status, error) {
                        console.error("Watchlist Fetch Error:", xhr.status, error);
                        results.innerHTML = `<div class="empty-state"><p>Error fetching watchlist: ${error}</p></div>`;
                    }
                });
            } else {
                results.innerHTML = `<div class="empty-state"><p>${searchData.message}</p></div>`;
            }
        },
        error: function (xhr, status, error) {
            console.error("Search API Error:", xhr.status, xhr.responseText);
            results.innerHTML = `<div class="empty-state"><p>Connection error (${xhr.status}: ${error}). Please check backend configuration.</p></div>`;
        },
    });
}

function showMovieDetails(id) {
    const searchMovie = globalMoviesData.find(m => m.id === id);
    
    if (searchMovie && searchMovie.detailed) {
        renderOverlayHTML(searchMovie.id, searchMovie.title, searchMovie.year, searchMovie.poster, searchMovie.detailed);
    } else {
        $.ajax({
            url: "DB_Ops.php",
            method: "POST",
            dataType: "json",
            data: { action: "get" },
            success: function (data) {
                if (data.status === "success") {
                    const watchlistMovie = data.data.find(m => m.id === id);
                    if (watchlistMovie) {
                        const d = watchlistMovie.detailed || watchlistMovie;
                        renderOverlayHTML(watchlistMovie.id, watchlistMovie.title, watchlistMovie.year, watchlistMovie.poster, d);
                    }
                } else {
                    console.error("Failed to fetch movie details:", data.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("DB_Ops Fetch Error:", xhr.status, error);
                alert("Failed to load movie details. Check console for errors.");
            }
        });
    }
}

function renderOverlayHTML(id, title, year, poster, d) {
    const actorsList = d.Actors ? d.Actors.split(',').map(actor => `<div class="actor-chip"><div class="actor-avatar">${actor.trim().charAt(0)}</div><span>${actor.trim()}</span></div>`).join('') : '';
    const imgPoster = poster !== 'N/A' && poster ? poster : 'https://via.placeholder.com/300x450?text=No+Image';

    document.getElementById('overlayBody').innerHTML = `<div class="overlay-container">
        <div class="overlay-poster"><img src="${imgPoster}" /></div>
        <div class="overlay-info">
            <h2 class="overlay-title">${title} <span class="year-span">(${year})</span></h2>
            <div class="overlay-meta"><span>🎬 ${d.Genre || 'Unknown'}</span> • <span>⏳ ${d.Runtime || 'Unknown'}</span> • <span>⭐ ${d.imdbRating || 'N/A'}</span></div>
            <div class="actors-section"><p class="section-label">CAST</p><div class="actors-grid">${actorsList}</div></div>
            <div class="plot-section"><p class="section-label">PLOT</p><p class="plot-text">${d.Plot || 'No plot available.'}</p></div>
            <button class="btn btn-primary" id="overlay-add-btn" onclick="addToWatchlist('${id}')" style="margin-top:20px; width:auto; padding:10px 25px;">+ Add to Watchlist</button>
        </div>
    </div>`;

    document.getElementById('movieOverlay').classList.remove('hidden');

    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: { action: "get" },
        success: function (data) {
            if (data.status === "success") {
                const watchlistIds = data.data.map(m => m.id);
                if (watchlistIds.includes(id)) {
                    const overlayBtn = document.getElementById("overlay-add-btn");
                    if (overlayBtn) {
                        overlayBtn.disabled = true;
                        overlayBtn.textContent = "✓ Added";
                        overlayBtn.classList.add("is-added");
                    }
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("Watchlist Status Check Error:", xhr.status, error);
        }
    });
}