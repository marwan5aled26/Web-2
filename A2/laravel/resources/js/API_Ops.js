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

    console.log("ana henna5")
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
        url: "/searchMovie",
        method: "GET",
        dataType: "json",
        data: { query: query },
        success: function (data) {
            if (data.status === "success") {
                globalMoviesData = data.movies;
                let resultsHTML = "";

                data.movies.forEach((movie) => {
                    let poster = movie.poster === "N/A" || !movie.poster ? "https://via.placeholder.com/300x450?text=No+Image" : movie.poster;
                    const imdbRating = movie.detailed ? movie.detailed.imdbRating : "N/A";
                    const plot = movie.detailed ? movie.detailed.Plot : "No plot available.";

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
                            <button class="btn btn-add" id="btn-${movie.id}" onclick="addToWatchlist('${movie.id}')">Add to Watchlist</button>
                        </div>
                    </div>`;
                });

                results.innerHTML = resultsHTML;
                sessionStorage.setItem("lastResults", resultsHTML);
                sessionStorage.setItem("lastMoviesData", JSON.stringify(globalMoviesData));
                sessionStorage.setItem("lastQuery", query);
            } else {

                results.innerHTML = `<div class="empty-state"><p>${data.message}</p></div>`;
            }
        },
        error: function (xhr) {

            console.error(xhr.responseText);
            results.innerHTML = `<div class="empty-state"><p>Connection error. Please try again.</p></div>`;
        },
    });
}

function showMovieDetails(id) {
    const movie = globalMoviesData.find(m => m.id === id);
    if (!movie || !movie.detailed) return;

    const d = movie.detailed;
    const actorsList = d.Actors.split(',').map(actor => `<div class="actor-chip"><div class="actor-avatar">${actor.trim().charAt(0)}</div><span>${actor.trim()}</span></div>`).join('');

    document.getElementById('overlayBody').innerHTML = `<div class="overlay-container">
        <div class="overlay-poster"><img src="${movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Image'}" /></div>
        <div class="overlay-info">
            <h2 class="overlay-title">${movie.title} <span class="year-span">(${movie.year})</span></h2>
            <div class="overlay-meta"><span>🎬 ${d.Genre}</span> • <span>⏳ ${d.Runtime}</span> • <span>⭐ ${d.imdbRating}</span></div>
            <div class="actors-section"><p class="section-label">CAST</p><div class="actors-grid">${actorsList}</div></div>
            <div class="plot-section"><p class="section-label">PLOT</p><p class="plot-text">${d.Plot}</p></div>
            <button class="btn btn-primary" id="overlay-add-btn" onclick="addToWatchlist('${movie.id}')" style="margin-top:20px; width:auto; padding:10px 25px;">+ Add to Watchlist</button>
        </div>
    </div>`;

    document.getElementById('movieOverlay').classList.remove('hidden');

    $.ajax({
        url: "/get-movies",
        method: "GET",
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                const watchlistIds = data.data.map(movie => movie.id);
                if (watchlistIds.includes(id)) {
                    const overlayBtn = document.getElementById("overlay-add-btn");
                    if (overlayBtn) {
                        overlayBtn.disabled = true;
                        overlayBtn.textContent = "✓ Added";
                        overlayBtn.classList.add("is-added");
                    }
                }
            }
        }
    });
}