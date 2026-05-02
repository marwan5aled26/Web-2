# 🎬 MovieTracker - Laravel Edition

A Web-Based Movie Watchlist Manager Built with Laravel
Search • Track • Rate • Enjoy

---

## 📌 About This Project

This is Assignment 2 for the IS333 Web-Based Information Systems course. The project migrates the original MovieTracker application from Vanilla PHP to the Laravel Framework.

---

## 📌 For Users

### What You Can Do

| Feature | Description |
|---------|-------------|
| Search Movies | Find any movie with plot, cast & IMDb rating |
| Build Watchlist | Save movies you want to watch |
| Rate Movies | Give ratings from 0 to 10 |
| Add Notes | Write your personal thoughts |
| Upload Posters | Add custom images (URL or file) |
| Edit Anytime | Update ratings & notes later |
| Remove Movies | Delete from watchlist |

### How to Use

1. Search - Type a movie name and hit search
2. Add - Click "Add to Watchlist" to save it
3. View - Go to "My Watchlist" to see all saved movies
4. Customize - Click "Edit" to rate or add notes

---

## 👨‍💻 For Developers

### Laravel Concepts Used

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

### Project Structure

Assignment-2/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MovieController.php
│   │   │   └── ApiController.php
│   │   └── Requests/
│   │       └── MovieRequest.php
│   ├── Models/
│   │   └── Movie.php
│   └── Services/
│       └── OmdbService.php
├── database/
│   ├── database.sqlite
│   ├── migrations/
│   │   └── create_movies_table.php
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── welcome.blade.php
│       ├── watchlist.blade.php
│       └── partials/
│           ├── header.blade.php
│           └── footer.blade.php
├── routes/
│   └── web.php
├── public/
│   └── css/
│       └── style.css
├── tests/
│   ├── Feature/
│   │   └── MovieTest.php
│   └── Unit/
│       └── MovieUnitTest.php
├── .env
└── Team_Members.txt

### Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | / | Homepage |
| GET | /watchlist | View all saved movies |
| POST | /movies | Add movie to watchlist |
| PUT | /movies/{id} | Update rating/note |
| DELETE | /movies/{id} | Remove from watchlist |
| GET | /api/search | Search OMDb API |

### Tech Stack

- Framework: Laravel 10+
- Frontend: HTML5, CSS3, JavaScript, jQuery, AJAX
- Database: SQLite (Eloquent ORM)
- API: OMDb API
- Testing: PHPUnit

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

## 🔐 Security Features

| Risk | Protection |
|------|------------|
| SQL Injection | Eloquent ORM |
| XSS Attacks | Blade auto-escaping |
| CSRF | Laravel CSRF tokens |
| API Keys | Stored in .env file |

---

## 👥 Team

Cairo University - Faculty of Computing & AI
IS333 Web-Based Information Systems | Spring 2026

| Name | ID |
|------|-----|
| Nada Shaaban Abdelrahman | 20231187 |
| Omnia Hassan Sayed | 20231027 |
| Yasmine Mohamed Maher | 20240833 |
| Marwan Khaled Sayed | 20230383 |
| Youssef Mohamed Mohamed | 20230511 |
| Youssef Ayman Bauomi | 20230483 |
| Mariam Ashraf | 20220543 |
| Almoaid Hashem Hashem | 20210625 |
| Basel Osama | 20221254 |

---

## 📦 Submission Notes

Before submitting:

1. Delete vendor/ folder
2. Ensure database/database.sqlite exists
3. Zip folder as: TeamNumber_ASSIGNMENT-2.zip

---

<p align="center">
  <b>🎬 Made with passion by Team MovieTracker</b><br>
  <sub>Cairo University • Faculty of Computers & Artificial Intelligence</sub>
</p>
