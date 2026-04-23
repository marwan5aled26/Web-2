<?php include 'header.php'; ?>


<!-- SEARCH SECTION -->
<section class="search-section">
    <div class="search-wrapper">
        <div class="search-bar">
            <span class="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
            </span>
            <input type="text" id="searchInput" placeholder="Search for a movie..." autocomplete="off" onkeypress="if(event.key === 'Enter') searchMovie()" />
            <button type="button" id="searchBtn" onclick="searchMovie()">Search</button>
        </div>
        <p class="search-hint">Powered by OMDb API</p>
    </div>
</section>

<!-- SEARCH RESULTS -->
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

<!-- MY WATCHLIST -->
<section class="mylist-section">
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
     EDIT MODAL
====================================================== -->
<div id="modalOverlay" class="modal-overlay hidden" onclick="closeModal(event)">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
            <h3 id="modalTitle">Edit Movie</h3>
            <button class="modal-close" onclick="closeModalDirect()" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body">
            <input type="hidden" id="editId" />

            <div class="form-group">
                <label for="editRating">Rating <span class="required">*</span></label>
                <div class="rating-input-wrap">
                    <input type="number" id="editRating" min="0" max="10" step="0.5" placeholder="0 – 10" />
                    <span class="rating-suffix">/ 10</span>
                </div>
                <span class="field-error hidden" id="ratingError">Rating must be between 0 and 10</span>
            </div>

            <div class="form-group">
                <label for="editNote">Personal Note</label>
                <textarea id="editNote" placeholder="Your thoughts about this movie..." rows="4"
                    maxlength="500"></textarea>
                <span class="char-count" id="charCount">0 / 500</span>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
            <button class="btn btn-primary" onclick="saveEdit()">
                <span>Save Changes</span>
            </button>
        </div>
    </div>
</div>

<!-- ======================================================
     TOAST NOTIFICATION
====================================================== -->
<div id="toast" class="toast" role="alert" aria-live="polite"></div>

<!-- ======================================================
     LOADER
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
