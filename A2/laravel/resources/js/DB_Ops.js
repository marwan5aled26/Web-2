function addToWatchlist(imdbId) {
    const btn = event.currentTarget;
    const isOverlay = btn.closest("#movieOverlay");
    
    const title = isOverlay ? document.querySelector(".overlay-title").textContent.replace(/\(.*\)/, '').trim() : btn.closest(".card").querySelector(".card-title").textContent.trim();
    
    const year = isOverlay ? document.querySelector(".year-span").textContent.replace(/[()]/g, '') : (btn.closest(".card").querySelector(".movie-year") || btn.closest(".card").querySelector(".card-year")).textContent.replace("Year:", "").trim();
    
    const poster = isOverlay ? document.querySelector(".overlay-poster img").src : btn.closest(".card").querySelector(".card-poster").src;

    $.ajax({
        url: "/add-movie",
        method: "POST",
        dataType: "json",
        data: { id: imdbId, title: title, year: year, rating: 0, note: "", poster: poster },
        success: function(data) {
            if (data.status === "success") {
                showToast("Added to watchlist! 🎬", "success");
                const searchBtn = document.getElementById(`btn-${imdbId}`);
                if (searchBtn) {
                    searchBtn.disabled = true;
                    searchBtn.textContent = "✓ Added";
                    searchBtn.classList.add("is-added");
                }
                const overlayBtn = document.getElementById("overlay-add-btn");
                if (overlayBtn) {
                    overlayBtn.disabled = true;
                    overlayBtn.textContent = "✓ Added";
                    overlayBtn.classList.add("is-added");
                }
                loadWatchlist();
            } else showToast(data.message, "error");
        },
        error: () => showToast("Failed to add movie.", "error")
    });
}

function deleteMovie(id) {
    if (!confirm("Remove this movie from your watchlist?")) return;
    $.ajax({
        url: "/delete-movie/" + id,
        method: "DELETE",
        dataType: "json",
        success: function(data) {
            if (data.status === "success") {
                showToast("Movie removed.", "info");
                loadWatchlist();
                const btn = document.getElementById(`btn-${id}`);
                if (btn) { btn.disabled = false; btn.textContent = "Add to Watchlist"; btn.classList.remove("is-added"); }
                const overlayBtn = document.querySelector("#movieOverlay .btn-primary");
                if (overlayBtn) { overlayBtn.disabled = false; overlayBtn.textContent = "+ Add to Watchlist"; overlayBtn.classList.remove("is-added"); }
            } else showToast(data.message, "error");
        }
    });
}

function loadWatchlist() {
    $.ajax({
        url: "/get-movies",
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.status !== "success") return showToast(data.message, "error");
            const movies = data.data;
            const container = document.getElementById("myList");
            document.getElementById("listCount").textContent = movies.length ? `(${movies.length})` : "";
            
            if (!movies.length) {
                container.innerHTML = `<div class="empty-state"><div class="empty-icon">🎞️</div><p>Your watchlist is empty.<br>Search for a movie and add it!</p></div>`;
                return;
            }
            
            container.innerHTML = movies.map(movie => {
                const poster = (!movie.poster || movie.poster === "N/A") ? "https://via.placeholder.com/300x450?text=No+Image" : movie.poster;
                const stars = movie.rating > 0 ? "★".repeat(Math.round(movie.rating / 2)) + "☆".repeat(5 - Math.round(movie.rating / 2)) : "";
                const safeId = encodeURIComponent(String(movie.id));
                const safeNote = encodeURIComponent(movie.note || '');
                
                return `<div class="card" id="card-${movie.id}">
                    <div class="card-poster-wrap" onclick="showMovieDetailsFromWatchlist('${movie.id}')" style="cursor:pointer">
                        <img src="${poster}" alt="${movie.title}" class="card-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                        ${movie.rating > 0 ? `<div class="poster-score"><span class="score-star">★</span><span>${movie.rating}</span></div>` : ""}
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${movie.title}</h3>
                        <div class="card-meta"><span class="movie-year">${movie.year}</span></div>
                        ${movie.rating > 0 ? `<p class="card-stars">${stars}</p><p class="card-rating">${movie.rating} / 10</p>` : `<p class="no-rating">Not rated yet</p>`}
                        ${movie.note ? `<p class="card-note" id="note-${movie.id}">${movie.note}</p>${movie.note.length > 120 ? `<button class="show-more-btn" onclick="toggleNote('${movie.id}', this)">Show More</button>` : ""}` : ""}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="openModal('${safeId}', ${movie.rating || 0}, '${safeNote}')">Edit</button>
                        <button class="btn btn-delete" onclick="deleteMovie('${safeId}')">Delete</button>
                    </div>
                </div>`;
            }).join('');
        }
        
    });
}

function toggleNote(id, btn) {
    const note = document.getElementById(`note-${id}`);
    const isExpanded = note.style.webkitLineClamp === "unset";
    note.style.webkitLineClamp = isExpanded ? "2" : "unset";
    btn.innerText = isExpanded ? "Show More" : "Show Less";
}

function showMovieDetailsFromWatchlist(id) {
    $.ajax({
        url: "/get-movies",
        method: "GET",
        dataType: "json",
        success: function(data) {
            const movie = data.data.find(m => m.id === id);
            if (movie) {
                document.getElementById('overlayBody').innerHTML = `<div class="overlay-container">
                    <div class="overlay-poster"><img src="${movie.poster}" /></div>
                    <div class="overlay-info">
                        <h2 class="overlay-title">${movie.title} <span class="year-span">(${movie.year})</span></h2>
                        ${movie.rating > 0 ? `<div class="overlay-meta">⭐ ${movie.rating}/10</div>` : ''}
                        ${movie.note ? `<div class="plot-section"><p class="section-label">YOUR NOTE</p><p class="plot-text">${movie.note}</p></div>` : ''}
                    </div>
                </div>`;
                document.getElementById('movieOverlay').classList.remove('hidden');
            }
        }
    });
}

function openModal(id, rating, note) {
    let decodedNote = note;
    try {
        decodedNote = decodeURIComponent(note);
    } catch(e) {
        decodedNote = note;
    }
    
    document.getElementById("editId").value = id;
    document.getElementById("editRating").value = rating;
    document.getElementById("editNote").value = decodedNote;
    document.getElementById("charCount").textContent = decodedNote.length + " / 500";
    document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal(e) { if (!e || e.target === document.getElementById("modalOverlay")) closeModalDirect(); }
function closeModalDirect() { document.getElementById("modalOverlay").classList.add("hidden"); }

function saveEdit() {
    const id = document.getElementById("editId").value;
    const rating = parseFloat(document.getElementById("editRating").value);
    let note = document.getElementById("editNote").value.trim();
    const ratingError = document.getElementById("ratingError");
    
    if (note.includes('%')) {
        try {
            note = decodeURIComponent(note);
        } catch(e) {}
    }
    
    if (isNaN(rating) || rating < 0 || rating > 10) {
        ratingError.classList.remove("hidden");
        return;
    }
    ratingError.classList.add("hidden");
    
    $.ajax({
        url: "/update-movie/" + id,
        method: "PUT",
        dataType: "json",
        data: { rating: rating, note: note },
        success: function(data) {
            if (data.status === "success") {
                showToast("Movie updated! ✨", "success");
                closeModalDirect();
                loadWatchlist();
            } else showToast(data.message, "error");
        }
    });
}

function openAddMovieModal() {
    ['addId', 'addTitle', 'addYear', 'addRating', 'addNote', 'addPoster'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const fileInput = document.getElementById('addPosterFile');
    if (fileInput) fileInput.value = '';
    const preview = document.getElementById('filePreview');
    if (preview) preview.style.display = 'none';
    document.getElementById('addCharCount').textContent = '0 / 500';
    clearAddMovieErrors();
    document.querySelector('input[name="posterType"][value="url"]').checked = true;
    togglePosterInput();
    document.getElementById('addMovieOverlay').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeAddMovieModal(e) { if (!e || e.target === document.getElementById('addMovieOverlay')) closeAddMovieModalDirect(); }
function closeAddMovieModalDirect() {
    document.getElementById('addMovieOverlay').classList.add('hidden');
    document.body.classList.remove('modal-open');
    clearAddMovieErrors();
}

function togglePosterInput() {
    const isUrl = document.querySelector('input[name="posterType"]:checked').value === 'url';
    document.getElementById('urlInputGroup').classList.toggle('hidden', !isUrl);
    document.getElementById('fileInputGroup').classList.toggle('hidden', isUrl);
    clearAddMovieErrors();
}

function clearAddMovieErrors() {
    ['addIdError', 'addTitleError', 'addYearError', 'addRatingError', 'addPosterError', 'addFileError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function validateAddMovieForm(id, title, year, rating) {
    if (!id) { showFieldError('addIdError', 'ID is required'); return false; }
    if (!/^[0-9]+$/.test(id)) { showFieldError('addIdError', 'ID must contain only numbers'); return false; }
    if (!title) { showFieldError('addTitleError', 'Title is required'); return false; }
    if (year && (year < 1900 || year > 2026)) { showFieldError('addYearError', 'Year must be between 1900 and 2026'); return false; }
    if (rating && (rating < 0 || rating > 10)) { showFieldError('addRatingError', 'Rating must be between 0 and 10'); return false; }
    return true;
}

function submitAddMovie() {
    clearAddMovieErrors();
    const id = document.getElementById('addId').value.trim();
    const title = document.getElementById('addTitle').value.trim();
    const year = document.getElementById('addYear').value.trim();
    const rating = document.getElementById('addRating').value.trim();
    const note = document.getElementById('addNote').value.trim();
    const isUrl = document.querySelector('input[name="posterType"]:checked').value === 'url';
    
    if (!validateAddMovieForm(id, title, year, rating)) {
        document.querySelector('.field-error:not(.hidden)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    showLoader();
    
    if (!isUrl) {
        const file = document.getElementById('addPosterFile').files[0];
        if (!file) {
            hideLoader();
            showFieldError('addFileError', 'Please select a poster image file');
            return;
        }
        const formData = new FormData();
        formData.append('poster_file', file);
        $.ajax({
            url: '/upload-poster',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: (uploadData) => uploadData.success ? addMovieToDatabase(id, title, year || null, rating || 0, note, uploadData.filepath) : (hideLoader(), showFieldError('addFileError', uploadData.error)),
            error: () => { hideLoader(); showFieldError('addFileError', 'Failed to upload poster image'); }
        });
    } else {
        const posterUrl = document.getElementById('addPoster').value.trim();
        if (!posterUrl) { hideLoader(); showFieldError('addPosterError', 'Please enter a poster URL'); return; }
        if (!posterUrl.match(/^https?:\/\/.+/i)) { hideLoader(); showFieldError('addPosterError', 'Please enter a valid URL'); return; }
        addMovieToDatabase(id, title, year || null, rating || 0, note, posterUrl);
    }
}

function addMovieToDatabase(id, title, year, rating, note, poster) {
    $.ajax({
        url: '/add-movie',
        method: 'POST',
        dataType: 'json',
        data: { id: id, title: title, year: year, rating: rating || 0, note: note, poster: poster },
        success: function(data) {
            hideLoader();
            if (data.status === 'success') {
                showToast("Movie added successfully!", "success");
                closeAddMovieModalDirect();
                loadWatchlist();
            } else {
                showFieldError('addIdError', data.message);
            }
        },
        error: () => { hideLoader(); showFieldError('addTitleError', 'Failed to add movie'); }
    });
}

function showToast(msg, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.className = "toast", 3000);
}

function showLoader() { document.getElementById('loader').classList.remove('hidden'); }
function hideLoader() { document.getElementById('loader').classList.add('hidden'); }

document.addEventListener("DOMContentLoaded", function() {
    loadWatchlist();
    const lastResults = sessionStorage.getItem("lastResults");
    const lastMoviesData = sessionStorage.getItem("lastMoviesData");
    
    if (lastResults && lastMoviesData) {
        document.getElementById("results").innerHTML = lastResults;
        document.getElementById("resultsSection").style.display = "block";
        const restoredData = JSON.parse(lastMoviesData);
        globalMoviesData = restoredData;
        
        document.querySelectorAll('#results .card-poster-wrap').forEach((element, index) => {
            const movieId = restoredData[index]?.id;
            if (movieId) {
                element.onclick = function() { showMovieDetails(movieId); };
            }
        });
    }
    
    document.getElementById("editNote")?.addEventListener("input", function() {
        document.getElementById("charCount").textContent = this.value.length + " / 500";
    });
    
    document.getElementById("addNote")?.addEventListener("input", function() {
        document.getElementById("addCharCount").textContent = this.value.length + " / 500";
    });
    
    document.getElementById('addPosterFile')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('filePreview');
        const previewImg = document.getElementById('previewImg');
        clearAddMovieErrors();
        
        if (!file) {
            if (preview) preview.style.display = 'none';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showFieldError('addFileError', 'File too large! Max 5MB');
            this.value = '';
            if (preview) preview.style.display = 'none';
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
            showFieldError('addFileError', 'Invalid file type! Only JPG, PNG, WEBP');
            this.value = '';
            if (preview) preview.style.display = 'none';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => { if (previewImg) previewImg.src = e.target.result; if (preview) preview.style.display = 'block'; };
        reader.readAsDataURL(file);
    });
    
    const idInput = document.getElementById('addId');
    if (idInput) {
        idInput.addEventListener('input', function() {
            const val = this.value;
            const num = val.replace(/[^0-9]/g, '');
            if (val !== num) this.value = num;
            document.getElementById('addIdError')?.classList.add('hidden');
        });
    }
    
    ['addTitle', 'addYear', 'addRating'].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.addEventListener('blur', () => {
            const errorId = field + 'Error';
            const errorEl = document.getElementById(errorId);
            if (errorEl && !errorEl.classList.contains('hidden')) errorEl.classList.add('hidden');
        });
    });
});