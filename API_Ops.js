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
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
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
  results.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Searching the archives...</p>
        </div>
    `;

  $.ajax({
    url: "API_Ops.php",
    method: "POST",
    dataType: "json",
    data: {
      action: "search",
      query: query,
    },
    success: function (data) {
      if (data.status === "success") {
        let resultsHTML = "";

    
        data.movies.forEach((movie) => {
          let poster =
            movie.poster === "N/A" || !movie.poster
              ? "https://via.placeholder.com/300x450?text=No+Image"
              : movie.poster;

          const imdbRating = movie.detailed ? movie.detailed.imdbRating : "N/A";
          const plot = movie.detailed
            ? movie.detailed.Plot
            : "No plot available.";

          const alreadyAdded = false;
          const buttonClass = alreadyAdded
            ? "btn btn-add is-added"
            : "btn btn-add";
          const buttonText = alreadyAdded ? "Added" : "Add to Watchlist";

          resultsHTML += `
    <div class="card">
        <div class="card-poster-wrap">
            <img src="${poster}" 
                 alt="${movie.title}" 
                 class="card-poster"
                 onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">

            ${
              imdbRating !== "N/A"
                ? `
                <div class="poster-score">
                    <span class="score-star">★</span>
                    <span>${imdbRating}</span>
                </div>
            `
                : ""
            }
        </div>

        <div class="card-body">
            <h3 class="card-title">${movie.title}</h3>

            <div class="card-meta">
                <span class="movie-year">${movie.year}</span>
            </div>

            <div class="genre-tags">
                ${
                  movie.detailed && movie.detailed.Genre
                    ? movie.detailed.Genre.split(",")
                        .slice(0, 3)
                        .map(
                          (genre) =>
                            `<span class="genre-tag">${genre.trim()}</span>`,
                        )
                        .join("")
                    : `<span class="genre-tag">Unknown</span>`
                }
            </div>

            <p class="card-note" id="plot-${movie.id}">
    ${plot}
</p>

${
  plot.length > 120
    ? `<button class="show-more-btn"
        onclick="togglePlot('${movie.id}', this)">
        Show More
    </button>`
    : ""
}
        </div>

        <div class="card-actions">
            <button class="${buttonClass}" 
                    id="btn-${movie.id}" 
                    onclick="addToWatchlist('${movie.id}')">
                ${buttonText}
            </button>
        </div>
    </div>
`;
        });

        results.innerHTML = resultsHTML;
        sessionStorage.setItem("lastResults", resultsHTML);
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
