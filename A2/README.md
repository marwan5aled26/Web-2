# 🎬 MovieTracker - Laravel Edition

**A Web-Based Movie Watchlist Manager Built with Laravel**

*Search • Track • Rate • Enjoy*

---

## 🔗 **Live Demo:**

Coming Soon

---

## 👨‍💻 For Developers

###  Key Concepts Learned

| Concept | Implementation |
|---------|----------------|
| MVC Pattern | Models for data, Views for UI, Controllers for logic |
| Blade Templates | Master layout with yield and include |
| Eloquent ORM | Database operations without raw SQL |
| Migrations | Version control for database schema |
| Form Requests | Server-side validation rules |
| Resource Routes | RESTful routing for CRUD |
| Service Pattern | API calls isolated in service class |
| Environment Variables | API keys in .env file |

### File Structure

| File | Job |
|------|-----|
| `app/Http/Controllers/Controller.php` | CRUD operations (add, edit, delete, view) |
| `app/Http/Controllers/MovieController.php` | CRUD operations (add, edit, delete, view) |
| `app/Http/Requests/SearchMovieRequest.php` | Server-side validation rules |
| `app/Http/Requests/StoreMovieRequest.php` | Server-side validation rules |
| `app/Http/Requests/UpdateMovieRequest.php` | Server-side validation rules |
| `app/Http/Requests/UploadPosterRequest.php` | Server-side validation rules |
| `app/Models/Movie.php` | Eloquent model for database |
| `app/Providers/AppServiceProvider.php` | API service layer (hides API key logic) |
| `database/migrations/create_movies_laravel_table.php` | Database schema setup |
| `database/seeders/MoviesSeeder.php` | Database schema setup |
| `database/database.sqlite` | SQLite database file |
| `resources/css/style.css` | All colors & designs (ported from A1) |
| `resources/js/API_Ops.js` | All colors & designs (ported from A1) |
| `resources/js/DB_Ops.js` | All colors & designs (ported from A1) |
| `resources/views/layouts/app.blade.php` | Master layout (header + footer) |
| `resources/views/partials/header.blade.php` | Top navigation bar |
| `resources/views/partials/footer.blade.php` | Bottom credits |
| `resources/views/welcome.blade.php` | Homepage with search |
| `routes/web.php` | All application routes |
| `tests/Feature/MovieTest.php` | Feature tests (end-to-end) |
| `tests/Unit/MovieUnitTest.php` | Unit tests (isolated logic) |
| `.env` | API keys & environment config |

### Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | / | index |
| GET | /get-movies | View all saved movies |
| POST | /add-movie | Add movie to watchlist |
| PUT | /update-movie/{id} | Update rating/note |
| DELETE | /delete-movie/{id} | Remove from watchlist |
| GET | /searchMovie | Search for a movie |

### Tech Stack

- **Framework**: Laravel 10+
- **Frontend**: HTML5, CSS3, JavaScript, jQuery, AJAX
- **Database**: SQLite (Eloquent ORM)
- **API**: OMDb API
- **Testing**: PHPUnit

---

## 🔐 Security Features

| Risk | Protection |
|------|------------|
| SQL Injection | Eloquent ORM |
| XSS Attacks | Blade auto-escaping |
| CSRF | Laravel CSRF tokens |
| API Keys | Stored in .env file |

---

## 🚀 Local Setup

### Prerequisites

- PHP 8.1 or higher
- Composer

### Installation Steps

1. Enter project directory: cd Assignment-2
2. Install dependencies: composer install
3. Copy environment file: cp .env.example .env
4. Generate application key: php artisan key:generate
5. Configure .env for SQLite (set DB_CONNECTION=sqlite)
6. Create SQLite database file: touch database/database.sqlite
7. Run migrations: php artisan migrate
8. Start development server: php artisan serve

### Environment Configuration (.env)

APP_NAME=MovieTracker
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
OMDB_API_KEY=your_api_key_here

---

## 🧪 Running Tests

php artisan test

---

<p align="center">
  <b>🎬 Made with passion by Team MovieTracker</b><br>
  <sub>Cairo University • Faculty of Computers & Artificial Intelligence</sub>
</p>
