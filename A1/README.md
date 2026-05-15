# 🎬 MovieTracker - Vanilla PHP Edition

**A Web-Based Movie Watchlist Manager**  

*Search • Track • Rate • Enjoy*

---

## 🔗 **Live Demo:**

[movietracker-fcai-cu.infinityfree.me](https://movietracker-fcai-cu.infinityfree.me)

---

## 👨‍💻 For Developers

### Key Concepts Learned

| Concept | Implementation |
|---------|----------------|
| Three-Tier Architecture | UI ↔ Logic ↔ Database - each layer separate |
| AJAX | Page never reloads - data loads silently in background |
| Prepared Statements | Protects against SQL injection hackers |
| SessionStorage | Search results survive page refresh |
| Single Responsibility | Each file has ONE job (no spaghetti code) |
| API Security | Secret keys stay on server, never in browser |
| Two-Way Validation | JavaScript (quick) + PHP (secure) checks |
| Secure File Upload | Size + type validation, unique file names |

### File Structure

| File | Job |
|------|-----|
| `index.php` | Main page layout |
| `header.php` | Top navigation bar |
| `footer.php` | Bottom credits |
| `style.css` | All colors & designs |
| `DB_Ops.php` | Database operations |
| `API_Ops.php` | OMDb API calls |
| `Upload.php` | Image upload handling |
| `*_Ops.js` | AJAX requests |
| `posters/` | Uploaded images folder |
| `movie_app.sql` | Database setup |

### Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, jQuery
- **Backend:** PHP 7.4+
- **Database:** MySQL
- **API:** OMDb API
- **Server:** Apache (XAMPP)

---

## 🔐 Security

| Risk | Protection |
|------|------------|
| SQL Injection | Prepared statements |
| XSS Attacks | `htmlspecialchars()` |
| Bad Uploads | File type + size limits |
| Exposed Keys | Server-side only |

---

## 🚀 Local Setup

1. Install XAMPP
2. Copy folder to `htdocs/`
3. Start Apache & MySQL
4. Import `movie_app.sql` to phpMyAdmin
5. Open `http://localhost/Web-2/A1`

---

<p align="center">
  <b>🎬 Made with passion by Team MovieTracker</b><br>
  <sub>Cairo University • Faculty of Computers & Artificial Intelligence</sub>
</p>
