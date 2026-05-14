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

| Section | File | Responsibility |
|---|---|---|
| **Application Structure** | `app/Http/Controllers/Controller.php` | Base controller class used by all controllers |
|  | `app/Http/Controllers/MovieController.php` | Handles Movie CRUD operations (create, read, update, delete) |
|  | `app/Http/Requests/SearchMovieRequest.php` | Validation rules for movie search requests |
|  | `app/Http/Requests/StoreMovieRequest.php` | Validation rules for storing new movies |
|  | `app/Http/Requests/UpdateMovieRequest.php` | Validation rules for updating existing movies |
|  | `app/Http/Requests/UploadPosterRequest.php` | Validation rules for poster image uploads |
|  | `app/Models/Movie.php` | Eloquent model representing the movies table |
|  | `app/Providers/AppServiceProvider.php` | Service layer setup and API integration (hides API key logic) |
| **Database Layer** | `database/migrations/create_movies_laravel_table.php` | Creates database schema for movies table |
|  | `database/seeders/MoviesSeeder.php` | Seeds sample movie records into database |
|  | `database/database.sqlite` | SQLite database file used for local development/testing |
| **Frontend Assets** | `resources/css/style.css` | Main styling, colors, and UI design (ported from Assignment 1) |
|  | `resources/js/API_Ops.js` | Frontend API interaction logic |
|  | `resources/js/DB_Ops.js` | Frontend database interaction logic |
| **Blade Views** | `resources/views/layouts/app.blade.php` | Main master layout containing shared structure |
|  | `resources/views/partials/header.blade.php` | Header and top navigation bar |
|  | `resources/views/partials/footer.blade.php` | Footer and credits section |
|  | `resources/views/welcome.blade.php` | Homepage containing movie search and main UI |
| **Routes** | `routes/web.php` | Defines all web application routes |
| **Testing** | `tests/Feature/MovieTest.php` | Feature tests for full HTTP request lifecycle |
|  | `tests/Unit/MovieUnitTest.php` | Unit tests for isolated business logic and validation |
| **Configuration** | `.env` | Environment configuration and API keys |

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
- Laravel

### Installation Steps

**Use Terminal in VS Code**

1. Pull the project from Repo  

2. Enter project directory:
`cd Web 2/A2/laravel`

4. Install dependencies:
`composer install`

5. Copy environment file:  
`cp .env.example .env`

6. Generate application key:
`php artisan key:generate`

8. Edit .env:

    For using SQLite:
    
    DB_CONNECTION=sqlite
    
    DB_DATABASE=database/database.sqlite
    
    <br/>
    For using MySQL:
    
    DB_CONNECTION=mysql
    
    DB_DATABASE=movie_app
    
    <br/>
    Add API Key & URL:
    
    API_KEY=daeab9a1

    API_URL=http://www.omdbapi.com/

7. Run migrations:  
`php artisan migrate`

8. Insert initial data:  
`php artisan db:seed`

9. Start development server:
`php artisan serve`

---

## 🧪 Running Tests

php artisan test

---

<p align="center">
  <b>🎬 Made with passion by Team MovieTracker</b><br>
  <sub>Cairo University • Faculty of Computers & Artificial Intelligence</sub>
</p>
