#🎬 MovieTracker

https://img.shields.io/badge/Live-Demo-58a6ff?style=for-the-svg&logo=google-chrome
https://img.shields.io/badge/PHP-777BB4?style=for-the-svg&logo=php
https://img.shields.io/badge/MySQL-4479A1?style=for-the-svg&logo=mysql

Search, Track & Rate Your Favorite Movies – A clean, responsive web app for movie lovers.

🎯 For Users
What Can You Do?
Feature	What It Does
🔍 Search Movies	Find any movie with details like plot, cast, and IMDb rating
➕ Build Watchlist	Save movies you want to watch
⭐ Rate Movies	Give ratings from 0 to 10
📝 Add Personal Notes	Write your thoughts about each movie
🖼️ Upload Posters	Add custom poster images (URL or file upload)
✏️ Edit Anytime	Update ratings and notes later
🗑️ Remove Movies	Delete from watchlist when done
Quick Start Guide
Search – Type a movie name in the search bar

Add – Click "Add to Watchlist" to save it

Manage – Go to "My Watchlist" to see all saved movies

Customize – Click "Edit" to rate or add notes

👨‍💻 For Developers
Key Concepts You'll Learn
1. Three-Tier Architecture
text
Browser (UI)  ↔  PHP Server (Logic)  ↔  MySQL (Database)
     ↑                  ↑                    ↑
  HTML/CSS/JS       Business Rules        Data Storage
Each layer has one job. They talk to each other but don't mix.

2. AJAX = No Page Reloads
The page never refreshes. When you search or add a movie, data loads silently in the background. This creates a smooth, app-like experience.

3. SQL Injection Protection
Never trust user input. The project uses prepared statements – a safe way to send data to the database that prevents hackers from injecting malicious code.

4. SessionStorage = Memory After Refresh
If you refresh the page, your search results come back. The app saves data temporarily in your browser's memory.

5. Single Responsibility
Each file does exactly one thing:

File	Job
index.php	Page structure only
DB_Ops.php	Talks to database
API_Ops.php	Talks to OMDb API
Upload.php	Handles image uploads
style.css	Everything visual
*_Ops.js	Sends AJAX requests
6. API Integration (The Right Way)
Secret API keys live on the server, never in JavaScript. The browser asks your PHP, and your PHP asks the external API. The key stays hidden.

7. Two-Way Validation
Client-side (JavaScript) – Quick feedback before sending

Server-side (PHP) – Final security check before saving

8. Secure File Upload
Images are validated for size, type, and renamed uniquely. Malicious files are rejected.

📁 Project Structure (Simple View)
text
📂 MovieTracker/
├── 📄 index.php          → Main page (HTML only)
├── 📄 header.php         → Top navigation bar
├── 📄 footer.php         → Bottom credits
├── 📄 style.css          → All colors & layouts
├── 📄 DB_Ops.php         → Database read/write
├── 📄 API_Ops.php        → OMDb API calls
├── 📄 Upload.php         → Poster image uploads
├── 📄 *_Ops.js           → AJAX requests
├── 📂 posters/           → Uploaded images folder
└── 📄 movie_app.sql      → Database setup file
🔐 Security Features
Threat	Protection
SQL Injection	Prepared statements
XSS Attacks	htmlspecialchars() on all output
Malicious Uploads	File type + size validation
Exposed API Keys	Keys stay server-side only
👥 Team
Cairo University - Faculty of Computing and AI
*IS333 Web-Based Information Systems | Spring 2026*

Name	ID
Nada Shaaban Abdelrahman	20231187
Omnia Hassan Sayed	20231027
Yasmine Mohamed Maher	20240833
Marwan Khaled Sayed	20230383
Youssef Mohamed Mohamed	20230511
Youssef Ayman Bauomi	20230483
Mariam Ashraf	20220543
Almoaid Hashem Hashem	20210625
Basel Osama	20221254
🚀 Live Demo
👉 https://movietracker-fcai-cu.infinityfree.me

<p align="center"> Made with 🎬 by Team MovieTracker<br> <sub>Search • Track • Rate • Enjoy</sub> </p>
