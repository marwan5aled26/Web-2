// ── Add to Watchlist ─────────────────────────────────────
function addToWatchlist(imdbId) {
    const btn = event.currentTarget;
    const card = btn.closest('.card');
    const title  = card.querySelector('.card-title').textContent.trim();
    const year   = card.querySelector('.card-year').textContent.replace('Year: ', '').trim();
    const poster = card.querySelector('.card-poster').src;

    $.ajax({
        url: 'DB_Ops.php',
        method: 'POST',
        dataType: 'json',
        data: {
            action: 'add',
            title:  title,
            year:   year,
            rating: 0,
            note:   '',
            poster: poster
        },
        success: function(data) {
            if (data.status === 'success') {
                showToast('Added to watchlist! 🎬', 'success');
                btn.disabled = true;
                btn.textContent = '✓ Added';
                loadWatchlist();
            } else {
                showToast(data.message, 'error');
            }
        },
        error: function() {
            showToast('Failed to add movie.', 'error');
        }
    });
}

// ── Load Watchlist ───────────────────────────────────────
function loadWatchlist() {
    $.ajax({
        url: 'DB_Ops.php',
        method: 'POST',
        dataType: 'json',
        data: { action: 'get' },
        success: function(data) {
            if (data.status === 'success') {
                const list = data.data;
                const container = document.getElementById('myList');
                document.getElementById('listCount').textContent =
                    list.length > 0 ? `(${list.length})` : '';

                if (list.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state" id="emptyState">
                            <div class="empty-icon">🎞️</div>
                            <p>Your watchlist is empty.<br>Search for a movie and add it!</p>
                        </div>`;
                    return;
                }

                let html = '';
                list.forEach(movie => {
                    let poster = movie.poster;
                    if (!poster || poster === 'N/A') {
                        poster = 'https://via.placeholder.com/300x450?text=No+Image';
                    }
                    const stars = movie.rating > 0
                        ? '★'.repeat(Math.round(movie.rating / 2)) + '☆'.repeat(5 - Math.round(movie.rating / 2))
                        : '';

                    html += `
                        <div class="card" id="card-${movie.id}">
                            <div class="card-poster-wrap">
                                <img src="${poster}" alt="${movie.title} Poster" class="card-poster"
                                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                            </div>
                            <div class="card-body">
                                <p class="card-title">${movie.title}</p>
                                <p class="card-year">${movie.year}</p>
                                ${movie.rating > 0
                                    ? `<p class="card-stars">${stars}</p>
                                       <p class="card-rating">${movie.rating} / 10</p>`
                                    : `<p class="no-rating">Not rated yet</p>`}
                                ${movie.note ? `<p class="card-note">${movie.note}</p>` : ''}
                            </div>
                            <div class="card-actions">
                                <button class="btn btn-edit" onclick="openModal(${movie.id}, ${movie.rating}, \`${movie.note}\`)">Edit</button>
                                <button class="btn btn-delete" onclick="deleteMovie(${movie.id})">Delete</button>
                            </div>
                        </div>`;
                });
                container.innerHTML = html;
            }
        },
        error: function() {
            showToast('Failed to load watchlist.', 'error');
        }
    });
}

// ── Delete Movie ─────────────────────────────────────────
function deleteMovie(id) {
    if (!confirm('Remove this movie from your watchlist?')) return;
    $.ajax({
        url: 'DB_Ops.php',
        method: 'POST',
        dataType: 'json',
        data: { action: 'delete', id: id },
        success: function(data) {
            if (data.status === 'success') {
                showToast('Movie removed.', 'info');
                loadWatchlist();
            } else {
                showToast(data.message, 'error');
            }
        }
    });
}

// ── Modal (Edit) ─────────────────────────────────────────
function openModal(id, rating, note) {
    document.getElementById('editId').value    = id;
    document.getElementById('editRating').value = rating;
    document.getElementById('editNote').value   = note;
    document.getElementById('charCount').textContent = note.length + ' / 500';
    document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}
function closeModalDirect() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

function saveEdit() {
    const id     = document.getElementById('editId').value;
    const rating = parseFloat(document.getElementById('editRating').value);
    const note   = document.getElementById('editNote').value.trim();

    if (isNaN(rating) || rating < 0 || rating > 10) {
        document.getElementById('ratingError').classList.remove('hidden');
        return;
    }
    document.getElementById('ratingError').classList.add('hidden');

    $.ajax({
        url: 'DB_Ops.php',
        method: 'POST',
        dataType: 'json',
        data: { action: 'update', id: id, rating: rating, note: note },
        success: function(data) {
            if (data.status === 'success') {
                showToast('Movie updated! ✨', 'success');
                closeModalDirect();
                loadWatchlist();
            } else {
                showToast(data.message, 'error');
            }
        }
    });
}

// ── Toast ────────────────────────────────────────────────
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ── Char counter for note textarea ───────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadWatchlist();
    const lastResults = sessionStorage.getItem('lastResults');
     if (lastResults) {
        document.getElementById('results').innerHTML = lastResults;
        document.getElementById('resultsSection').style.display = 'block';}
        document.getElementById('editNote').addEventListener('input', function () {
        document.getElementById('charCount').textContent = this.value.length + ' / 500';
    });
});
