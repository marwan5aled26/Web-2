let globalMoviesData = []; 

function searchMovie(){
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query === '') {
        alert('Please enter a movie title to search.');
        return;
    }

    $.ajax({
        url: 'API_Ops.php',
        method: 'POST',
        dataType: 'json', 
        data: { action: 'search', query: query },
        success: function(data) {
            if (data.status === 'success') {
                globalMoviesData = data.movies; 
                let resultsHTML = '';

                data.movies.forEach(movie => {
                    let poster = (movie.poster === "N/A" || !movie.poster) ? "https://via.placeholder.com/300x450?text=No+Image" : movie.poster;

                    resultsHTML += `
                        <div class="card" onclick="showMovieDetails('${movie.id}')" style="cursor:pointer">
                            <img src="${poster}" alt="${movie.title}" class="card-poster">
                            <div class="movie-info">
                                <h3 class="card-title">${movie.title}</h3>
                                <p class="card-year">Year: ${movie.year}</p>
                                <button class="btn-add" onclick="event.stopPropagation(); addToWatchlist('${movie.id}')">
                                    <p class="card-actions">Add to Watchlist</p>
                                </button>
                            </div>
                        </div>
                    `;
                });
                document.getElementById('results').innerHTML = resultsHTML;
                document.getElementById('resultsSection').style.display = 'block';
                document.getElementById('resultsCount').innerText = `(${data.movies.length})`;
            } else {
                alert(data.message);
            }
        }
    });
}

function showMovieDetails(id) {
    const movie = globalMoviesData.find(m => m.id === id);
    if (!movie || !movie.detailed) return;

    const d = movie.detailed;
    
  
    const actorsList = d.Actors.split(',').map(actor => `
        <div class="actor-chip">
            <div class="actor-avatar">${actor.trim().charAt(0)}</div>
            <span>${actor.trim()}</span>
        </div>
    `).join('');

    document.getElementById('overlayBody').innerHTML = `
        <div class="overlay-container">
            <div class="overlay-poster">
                <img src="${movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Image'}" />
            </div>
            <div class="overlay-info">
                <h2 class="overlay-title">${movie.title} <span class="year-span">(${movie.year})</span></h2>
                <div class="overlay-meta">
                    <span>🎬 ${d.Genre}</span> • <span>⏳ ${d.Runtime}</span> • <span>⭐ ${d.imdbRating}</span>
                </div>
                
                <div class="actors-section">
                    <p class="section-label">CAST</p>
                    <div class="actors-grid">${actorsList}</div>
                </div>

                <div class="plot-section">
                    <p class="section-label">PLOT</p>
                    <p class="plot-text">${d.Plot}</p>
                </div>

                <button class="btn btn-primary" onclick="addToWatchlist('${movie.id}')" style="margin-top:20px; width:auto; padding:10px 25px;">
                    + Add to Watchlist
                </button>
            </div>
        </div>
    `;

    document.getElementById('movieOverlay').classList.remove('hidden');
}


