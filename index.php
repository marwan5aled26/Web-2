<?php include 'header.php'; ?>

<!-- ======================================================
    SEARCH SECTION
====================================================== -->
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

<!-- ======================================================
    SEARCH RESULTS SECTION
====================================================== -->
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

<!-- ======================================================
    MY WATCHLIST SECTION
====================================================== -->
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

<!-- ======================================================
    MOVIE DETAILS OVERLAY
====================================================== -->
<div id="movieOverlay" class="modal-overlay hidden" onclick="closeOverlay(event)">
    <div class="modal-content movie-detail-modal">
        <button class="close-btn" onclick="this.closest('.modal-overlay').classList.add('hidden')">&times;</button>
        <div id="overlayBody"></div>
    </div>
</div>

<!-- ======================================================
    EDIT MOVIE MODAL
====================================================== -->
<div id="modalOverlay" class="modal-overlay hidden" onclick="closeModal(event)">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">

        <!-- Edit Movie Modal Header -->
        <div class="modal-header">
            <h3 id="modalTitle">Edit Movie</h3>
            <button class="modal-close" onclick="closeModalDirect()" aria-label="Close">&times;</button>
        </div>

        <!-- Edit Movie Modal Body -->
        <div class="modal-body">
            <input type="hidden" id="editId" />

            <!-- Edit Movie Rating Field -->
            <div class="form-group">
                <label for="editRating">Rating</label>
                <div class="rating-input-wrap">
                    <input type="number" id="editRating" min="0" max="10" step="0.5" placeholder="0 – 10" />
                    <span class="rating-suffix">/ 10</span>
                </div>
                <span class="field-error hidden" id="ratingError">Rating must be between 0 and 10</span>
            </div>

            <!-- Edit Movie Note Field -->
            <div class="form-group">
                <label for="editNote">Personal Note</label>
                <textarea id="editNote" placeholder="Your thoughts about this movie..." rows="4" maxlength="500"></textarea>
                <span class="char-count" id="charCount">0 / 500</span>
            </div>
        </div>

        <!-- Edit Movie Modal Footer -->
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
            <button class="btn btn-primary" onclick="saveEdit()">Save Changes</button>
        </div>
    </div>
</div>

<!-- ======================================================
    ADD MOVIE MODAL
====================================================== -->
<div id="addMovieOverlay" class="modal-overlay hidden" onclick="closeAddMovieModal(event)">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="addMovieTitle">

        <!-- Add Movie Modal Header -->
        <div class="modal-header">
            <h3 id="addMovieTitle">Add New Movie</h3>
            <button class="modal-close" onclick="closeAddMovieModalDirect()" aria-label="Close">&times;</button>
        </div>

        <!-- Add Movie Modal Body -->
        <div class="modal-body">
            <form id="addMovieForm" enctype="multipart/form-data">

                <!-- Movie ID Input -->
                <div class="form-group">
                    <label for="addId">Movie ID <span class="required">*</span></label>
                    <input type="text" id="addId" placeholder="12345" />
                    <small class="field-hint">Only numbers allowed (e.g., 12345)</small>
                    <span class="field-error hidden" id="addIdError">ID must contain only numbers</span>
                </div>

                <!-- Movie Title Input -->
                <div class="form-group">
                    <label for="addTitle">Title <span class="required">*</span></label>
                    <input type="text" id="addTitle" placeholder="Movie title" />
                    <span class="field-error hidden" id="addTitleError">Title is required</span>
                </div>

                <!-- Movie Year Input -->
                <div class="form-group">
                    <label for="addYear">Year</label>
                    <input type="number" id="addYear" placeholder="2006" min="1900" max="2026" />
                    <span class="field-error hidden" id="addYearError">Year must be between 1900 and 2026</span>
                </div>

                <!-- Movie Rating Input -->
                <div class="form-group">
                    <label for="addRating">Rating (0-10)</label>
                    <div class="rating-input-wrap">
                        <input type="number" id="addRating" min="0" max="10" step="0.5" placeholder="0 – 10" />
                        <span class="rating-suffix">/ 10</span>
                    </div>
                    <span class="field-error hidden" id="addRatingError">Rating must be between 0 and 10</span>
                </div>

                <!-- Movie Note Input -->
                <div class="form-group">
                    <label for="addNote">Personal Note</label>
                    <textarea id="addNote" placeholder="Your thoughts about this movie..." rows="4" maxlength="500"></textarea>
                    <span class="char-count" id="addCharCount">0 / 500</span>
                </div>

                <!-- Poster Source Selection -->
                <div class="form-group">
                    <label>Poster Source<span class="required">*</span></label>
                    <div class="poster-type-group">
                        <label class="poster-type-label">
                            <input type="radio" name="posterType" value="url" checked onchange="togglePosterInput()"> URL Link (Online)
                        </label>
                        <label class="poster-type-label">
                            <input type="radio" name="posterType" value="file" onchange="togglePosterInput()"> Upload File (Offline)
                        </label>
                    </div>
                </div>

                <!-- Poster URL Input -->
                <div class="form-group" id="urlInputGroup">
                    <label for="addPoster">Poster URL</label>
                    <input type="url" id="addPoster" placeholder="https://example.com/poster.jpg" />
                    <small class="field-hint">Enter a valid image URL (starts with http:// or https://)</small>
                    <span class="field-error hidden" id="addPosterError">Please enter a valid image URL</span>
                </div>

                <!-- Poster File Upload Input -->
                <div class="form-group hidden" id="fileInputGroup">
                    <label for="addPosterFile">Poster Image File</label>
                    <input type="file" id="addPosterFile" accept="image/jpeg,image/png,image/jpg,image/webp" />
                    <small class="field-hint">Max size: 5MB. Allowed: JPG, PNG, WEBP</small>
                    <span class="field-error hidden" id="addFileError">Please select a valid image file (max 5MB, JPG/PNG/WEBP)</span>
                    <div id="filePreview" class="file-preview hidden">
                        <img id="previewImg" class="preview-image" />
                    </div>
                </div>
            </form>
        </div>

        <!-- Add Movie Modal Footer -->
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeAddMovieModalDirect()">Cancel</button>
            <button class="btn btn-primary" onclick="submitAddMovie()">Add to Watchlist</button>
        </div>
    </div>
</div>

<!-- ======================================================
    TOAST NOTIFICATION
====================================================== -->
<div id="toast" class="toast" role="alert" aria-live="polite"></div>

<!-- ======================================================
    LOADER OVERLAY
====================================================== -->
<div id="loader" class="loader-overlay hidden">
    <div class="spinner"></div>
</div>

<!-- ======================================================
    SCRIPTS
====================================================== -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="API_Ops.js"></script>
<script src="DB_Ops.js"></script>

<?php include 'footer.php'; ?>