/* WATCHLIST CRUD OPERATIONS */

function addToWatchlist(imdbId) {
    const btn = event.currentTarget;
    const card = btn.closest(".card");
    let title, year, poster;

    if (btn.closest("#movieOverlay")) {
        const overlayTitle = document.querySelector(".overlay-title");
        const overlayYear = document.querySelector(".year-span");
        const overlayPoster = document.querySelector(".overlay-poster img");
        title = overlayTitle ? overlayTitle.textContent.replace(/\(.*\)/, '').trim() : "";
        year = overlayYear ? overlayYear.textContent.replace(/[()]/g, '') : "";
        poster = overlayPoster ? overlayPoster.src : "";
    } else {
        title = card.querySelector(".card-title").textContent.trim();
        const yearElement = card.querySelector(".movie-year") || card.querySelector(".card-year");
        year = yearElement ? yearElement.textContent.replace("Year:", "").trim() : "";
        poster = card.querySelector(".card-poster").src;
    }

    const id = imdbId;

    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: {
            action: "add",
            id: id,
            title: title,
            year: year,
            rating: 0,
            note: "",
            poster: poster,
        },
        success: function (data) {
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
            } else {
                showToast(data.message, "error");
            }
        },
        error: function (data) {
            showToast("Failed to add movie.", "error");
        },
    });
}

function deleteMovie(id) {
    if (!confirm("Remove this movie from your watchlist?")) return;
    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: { action: "delete", id: id },
        success: function (data) {
            if (data.status === "success") {
                showToast("Movie removed.", "info");
                loadWatchlist();
                const searchBtn = document.getElementById(`btn-${id}`);
                if (searchBtn) {
                    searchBtn.disabled = false;
                    searchBtn.textContent = "Add to Watchlist";
                    searchBtn.classList.remove("is-added");
                }
                const overlayBtn = document.querySelector("#movieOverlay .btn-primary");
                if (overlayBtn) {
                    overlayBtn.disabled = false;
                    overlayBtn.textContent = "+ Add to Watchlist";
                    overlayBtn.classList.remove("is-added");
                }
            } else {
                showToast(data.message, "error");
            }
        },
    });
}

function loadWatchlist() {
    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: { action: "get" },
        success: function (data) {
            if (data.status === "success") {
                const list = data.data;
                const container = document.getElementById("myList");
                document.getElementById("listCount").textContent = list.length > 0 ? `(${list.length})` : "";

                if (list.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state" id="emptyState">
                            <div class="empty-icon">🎞️</div>
                            <p>Your watchlist is empty.<br>Search for a movie and add it!</p>
                        </div>`;
                    return;
                }

                let html = "";
                list.forEach((movie) => {
                    let poster = movie.poster;
                    if (!poster || poster === "N/A") {
                        poster = "https://via.placeholder.com/300x450?text=No+Image";
                    }
                    const safeId = encodeURIComponent(String(movie.id));
                    const safeNote = encodeURIComponent(movie.note || '');
                    const stars = movie.rating > 0
                        ? "★".repeat(Math.round(movie.rating / 2)) + "☆".repeat(5 - Math.round(movie.rating / 2))
                        : "";

                    html += `
                        <div class="card" id="card-${movie.id}">
                            <div class="card-poster-wrap">
                                <img src="${poster}" 
                                    alt="${movie.title} Poster" 
                                    class="card-poster"
                                    onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                                ${movie.rating > 0 ? `
                                    <div class="poster-score">
                                        <span class="score-star">★</span>
                                        <span>${movie.rating}</span>
                                    </div>
                                ` : ""}
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">${movie.title}</h3>
                                <div class="card-meta">
                                    <span class="movie-year">${movie.year}</span>
                                </div>
                                ${movie.rating > 0 ? `
                                    <p class="card-stars">${stars}</p>
                                    <p class="card-rating">${movie.rating} / 10</p>
                                ` : `<p class="no-rating">Not rated yet</p>`}
                                ${movie.note ? `
                                    <p class="card-note" id="note-${movie.id}">${movie.note}</p>
                                    ${movie.note.length > 120 ? `
                                        <button class="show-more-btn" onclick="togglePlot('${movie.id}', this, 'note')">Show More</button>
                                    ` : ""}
                                ` : ""}
                            </div>
                            <div class="card-actions">
                                <button class="btn btn-edit" onclick="openModal('${safeId}', ${movie.rating || 0}, '${safeNote}')">Edit</button>
                                <button class="btn btn-delete" onclick="deleteMovie('${safeId}')">Delete</button>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
        },
        error: function () {
            showToast("Failed to load watchlist.", "error");
        },
    });
}

function updateButtonsFromWatchlist() {
    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: { action: "get" },
        success: function (data) {
            if (data.status === "success" && data.data.length > 0) {
                const watchlistIds = data.data.map(movie => movie.id);
                watchlistIds.forEach(id => {
                    const btn = document.getElementById(`btn-${id}`);
                    if (btn) {
                        btn.disabled = true;
                        btn.textContent = "✓ Added";
                        btn.classList.add("is-added");
                    }
                });
            }
        }
    });
}

/* EDIT MODAL FUNCTIONS */

function openModal(id, rating, note) {
    document.getElementById("editId").value = id;
    document.getElementById("editRating").value = rating;
    document.getElementById("editNote").value = note;
    document.getElementById("charCount").textContent = note.length + " / 500";
    document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal(e) {
    if (e.target === document.getElementById("modalOverlay")) closeModalDirect();
}

function closeModalDirect() {
    document.getElementById("modalOverlay").classList.add("hidden");
}

function saveEdit() {
    const id = document.getElementById("editId").value;
    const rating = parseFloat(document.getElementById("editRating").value);
    const note = document.getElementById("editNote").value.trim();

    if (isNaN(rating) || rating < 0 || rating > 10) {
        document.getElementById("ratingError").classList.remove("hidden");
        return;
    }
    document.getElementById("ratingError").classList.add("hidden");

    $.ajax({
        url: "DB_Ops.php",
        method: "POST",
        dataType: "json",
        data: { action: "update", id: id, rating: rating, note: note },
        success: function (data) {
            if (data.status === "success") {
                showToast("Movie updated! ✨", "success");
                closeModalDirect();
                loadWatchlist();
            } else {
                showToast(data.message, "error");
            }
        },
    });
}

/* ADD MOVIE MODAL FUNCTIONS */

function openAddMovieModal() {
    document.getElementById('addId').value = '';
    document.getElementById('addTitle').value = '';
    document.getElementById('addYear').value = '';
    document.getElementById('addRating').value = '';
    document.getElementById('addNote').value = '';
    document.getElementById('addPoster').value = '';
    document.getElementById('addPosterFile').value = '';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('addCharCount').textContent = '0 / 500';
    clearAddMovieErrors();
    document.querySelector('input[name="posterType"][value="url"]').checked = true;
    togglePosterInput();
    document.getElementById('addMovieOverlay').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeAddMovieModal(event) {
    if (event.target === document.getElementById('addMovieOverlay')) {
        closeAddMovieModalDirect();
    }
}

function closeAddMovieModalDirect() {
    document.getElementById('addMovieOverlay').classList.add('hidden');
    document.body.classList.remove('modal-open');
    clearAddMovieErrors();
}

function togglePosterInput() {
    const urlGroup = document.getElementById('urlInputGroup');
    const fileGroup = document.getElementById('fileInputGroup');
    const posterType = document.querySelector('input[name="posterType"]:checked').value;

    if (posterType === 'url') {
        urlGroup.classList.remove('hidden');
        fileGroup.classList.add('hidden');
    } else {
        urlGroup.classList.add('hidden');
        fileGroup.classList.remove('hidden');
    }
    clearAddMovieErrors();
}

function clearAddMovieErrors() {
    const errorFields = ['addIdError', 'addTitleError', 'addYearError', 'addRatingError', 'addPosterError', 'addFileError'];
    errorFields.forEach(field => {
        const errorEl = document.getElementById(field);
        if (errorEl) errorEl.classList.add('hidden');
    });
}

function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

function submitAddMovie() {
    clearAddMovieErrors();

    const id = document.getElementById('addId').value.trim();
    const title = document.getElementById('addTitle').value.trim();
    const year = document.getElementById('addYear').value.trim();
    const rating = document.getElementById('addRating').value.trim();
    const note = document.getElementById('addNote').value.trim();
    const posterType = document.querySelector('input[name="posterType"]:checked').value;
    let hasError = false;

    if (!id) {
        showFieldError('addIdError', 'ID is required');
        hasError = true;
    } else if (!/^[0-9]+$/.test(id)) {
        showFieldError('addIdError', 'ID must contain only numbers');
        hasError = true;
    }

    if (!title) {
        showFieldError('addTitleError', 'Title is required');
        hasError = true;
    }

    const currentYear = new Date().getFullYear();
    if (year && (year < 1900 || year > 2026)) {
        showFieldError('addYearError', `Year must be between 1900 and 2026`);
        hasError = true;
    }

    if (rating && (rating < 0 || rating > 10)) {
        showFieldError('addRatingError', 'Rating must be between 0 and 10');
        hasError = true;
    }

    if (hasError) {
        const firstError = document.querySelector('.field-error:not(.hidden)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    showLoader();

    if (posterType === 'file') {
        const fileInput = document.getElementById('addPosterFile');
        const file = fileInput.files[0];

        if (!file) {
            hideLoader();
            showFieldError('addFileError', 'Please select a poster image file');
            return;
        }

        const formData = new FormData();
        formData.append('poster_file', file);

        $.ajax({
            url: 'Upload.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(uploadData) {
                if (uploadData.success) {
                    addMovieToDatabase(id, title, year || null, rating || 0, note, uploadData.filepath);
                } else {
                    hideLoader();
                    showFieldError('addFileError', uploadData.error);
                }
            },
            error: function() {
                hideLoader();
                showFieldError('addFileError', 'Failed to upload poster image');
            }
        });
    } else {
        const posterUrl = document.getElementById('addPoster').value.trim();

        if (!posterUrl) {
            hideLoader();
            showFieldError('addPosterError', 'Please enter a poster URL');
            return;
        }

        if (!posterUrl.match(/^https?:\/\/.+/i)) {
            hideLoader();
            showFieldError('addPosterError', 'Please enter a valid URL (starts with http:// or https://)');
            return;
        }

        addMovieToDatabase(id, title, year || null, rating || 0, note, posterUrl);
    }
}

function addMovieToDatabase(id, title, year, rating, note, poster) {
    $.ajax({
        url: 'DB_Ops.php',
        method: 'POST',
        dataType: 'json',
        data: {
            action: 'add',
            id: id,
            title: title,
            year: year,
            rating: rating || 0,
            note: note,
            poster: poster
        },
        success: function(data) {
            hideLoader();
            if (data.status === 'success') {
                closeAddMovieModalDirect();
                loadWatchlist();
                document.getElementById('addId').value = '';
                document.getElementById('addTitle').value = '';
                document.getElementById('addYear').value = '';
                document.getElementById('addRating').value = '';
                document.getElementById('addNote').value = '';
                document.getElementById('addPoster').value = '';
                document.getElementById('addPosterFile').value = '';
                document.getElementById('filePreview').style.display = 'none';
                document.getElementById('addCharCount').textContent = '0 / 500';
                document.querySelector('input[name="posterType"][value="url"]').checked = true;
                togglePosterInput();
                clearAddMovieErrors();
            } else {
                if (data.message.includes('duplicate') || data.message.includes('already exists')) {
                    showFieldError('addIdError', data.message);
                } else {
                    showFieldError('addTitleError', data.message);
                }
            }
        },
        error: function() {
            hideLoader();
            showFieldError('addTitleError', 'Failed to add movie. Please try again.');
        }
    });
}

/* TOAST NOTIFICATION */

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

/* LOADER FUNCTIONS */

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

/* UI HELPER */

function togglePlot(id, button, type = "plot") {
    const element = document.getElementById(`${type}-${id}`);

    if (element.style.webkitLineClamp === "unset") {
        element.style.webkitLineClamp = "2";
        button.innerText = "Show More";
    } else {
        element.style.webkitLineClamp = "unset";
        button.innerText = "Show Less";
    }
}

/* DOM CONTENT LOADED */

document.addEventListener("DOMContentLoaded", function () {
    loadWatchlist();

    const lastResults = sessionStorage.getItem("lastResults");
    const lastMoviesData = sessionStorage.getItem("lastMoviesData");

    if (lastResults && lastMoviesData) {
        document.getElementById("results").innerHTML = lastResults;
        document.getElementById("resultsSection").style.display = "block";
        globalMoviesData = JSON.parse(lastMoviesData);
        updateButtonsFromWatchlist();
    }

    document.getElementById("editNote").addEventListener("input", function () {
        document.getElementById("charCount").textContent = this.value.length + " / 500";
    });

    const fileInput = document.getElementById('addPosterFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('filePreview');
            const previewImg = document.getElementById('previewImg');
            const fileError = document.getElementById('addFileError');
            clearAddMovieErrors();

            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showFieldError('addFileError', 'File too large! Maximum size is 5MB.');
                    this.value = '';
                    preview.style.display = 'none';
                    return;
                }

                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    showFieldError('addFileError', 'Invalid file type! Only JPG, PNG, and WEBP are allowed.');
                    this.value = '';
                    preview.style.display = 'none';
                    return;
                }

                fileError.classList.add('hidden');
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
                previewImg.src = '';
            }
        });
    }

    const idInput = document.getElementById('addId');
    if (idInput) {
        idInput.addEventListener('input', function() {
            const originalValue = this.value;
            const numericValue = originalValue.replace(/[^0-9]/g, '');
            if (originalValue !== numericValue) {
                this.value = numericValue;
                showFieldError('addIdError', 'ID must contain only numbers');
            } else {
                const idError = document.getElementById('addIdError');
                if (idError) idError.classList.add('hidden');
            }
        });
    }

    const titleInput = document.getElementById('addTitle');
    if (titleInput) {
        titleInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                showFieldError('addTitleError', 'Title is required');
            } else {
                const titleError = document.getElementById('addTitleError');
                if (titleError) titleError.classList.add('hidden');
            }
        });
    }

    const yearInput = document.getElementById('addYear');
    if (yearInput) {
        yearInput.max = 2026;
        yearInput.min = 1900;

        yearInput.addEventListener('blur', function() {
            const maxYear = 2026;
            if (this.value.trim() !== '') {
                const year = parseInt(this.value);
                if (year < 1900 || year > maxYear) {
                    showFieldError('addYearError', `Year must be between 1900 and 2026`);
                } else {
                    const yearError = document.getElementById('addYearError');
                    if (yearError) yearError.classList.add('hidden');
                }
            } else {
                const yearError = document.getElementById('addYearError');
                if (yearError) yearError.classList.add('hidden');
            }
        });
    }

    const ratingInput = document.getElementById('addRating');
    if (ratingInput) {
        ratingInput.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const rating = parseFloat(this.value);
                if (rating < 0 || rating > 10) {
                    showFieldError('addRatingError', 'Rating must be between 0 and 10');
                } else {
                    const ratingError = document.getElementById('addRatingError');
                    if (ratingError) ratingError.classList.add('hidden');
                }
            } else {
                const ratingError = document.getElementById('addRatingError');
                if (ratingError) ratingError.classList.add('hidden');
            }
        });
    }

    const noteInput = document.getElementById('addNote');
    if (noteInput) {
        noteInput.addEventListener('input', function() {
            document.getElementById('addCharCount').textContent = this.value.length + ' / 500';
        });
    }
});