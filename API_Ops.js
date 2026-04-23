

function searchMovie(){
    window.location.hash = '';
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
    data: {
        action: 'search',
        query: query
    },
    success: function(data) {
        if (data.status === 'success') {
            let resultsHTML = '';

            data.movies.forEach(movie => {

            let poster = movie.poster;

            if (poster === "N/A" || poster === "") {
                poster = "https://via.placeholder.com/300x450?text=No+Image";
            }

            resultsHTML += `
                <div class="card">
                    <img src="${poster}" 
                        alt="${movie.title} Poster" 
                        class="card-poster"
                        onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                    
                    <div class="movie-info">
                        <h3 class="card-title">${movie.title} </h3>
                        <p class="card-year">Year: ${movie.year}</p>
                        <p class="card-rating">Rating: ${movie.detailed ? movie.detailed.imdbRating : 'N/A'}</p>
                        <p class="card-note">Plot: ${movie.detailed ? movie.detailed.Plot : 'No plot available.'}</p>
                        <button class="btn-add" id="btn-${movie.id}" onclick="addToWatchlist('${movie.id}')"><p class= "card-actions">Add to Watchlist</p></button>
                    </div>
                </div>
            `;
        });
            document.getElementById('results').innerHTML = resultsHTML;
            document.getElementById('resultsSection').style.display = 'block';
            sessionStorage.setItem('lastResults', resultsHTML); 
            sessionStorage.setItem('lastQuery', query);

        } else {
            alert(data.message);
        }
    },
    error: function(xhr, status, error) {
        console.log(xhr.responseText); 
        alert('An error occurred while searching for the movie.');
    }
});
}
