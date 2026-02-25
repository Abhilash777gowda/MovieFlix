<div align="center">
  <h1>🎬 MovieFlix</h1>
  <p><strong>A Netflix-inspired movie streaming platform built with the MERN stack</strong></p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
  ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)
</div>

---

## 🌟 Features

- 🔐 **Google Sign-In** via Firebase Authentication
- 🎥 **Browse Movies, TV Shows, New & Popular** — powered by TMDB API
- 🔍 **Real-time Search** with genre filter tabs
- 📋 **Watchlist** — save movies & manage your list
- ❤️ **Like System** — like/unlike movies, synced with the database
- 🎬 **Movie Modal** — trailer playback, cast, details, similar movies
- 🌙 **Dark / Light Mode** toggle — persisted across sessions
- 📱 **Fully Responsive** — works on phones, tablets, and desktops
- 🔔 **Notification Panel**
- 🎠 **Auto-rotating Banner** with featured movies
- ✅ **Unit Tested** — client (Vitest) & server (Jest + Supertest)

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 6](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [React Router DOM 7](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP requests |
| [Lucide React](https://lucide.dev) | Icon library |
| [Firebase](https://firebase.google.com) | Google OAuth authentication |

### Backend
| Tech | Purpose |
|---|---|
| [Node.js](https://nodejs.org) | JavaScript runtime |
| [Express 5](https://expressjs.com) | REST API framework |
| [MongoDB](https://mongodb.com) | NoSQL database |
| [Mongoose](https://mongoosejs.com) | ODM for MongoDB |
| [CORS](https://www.npmjs.com/package/cors) | Cross-origin requests |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variables |

### APIs & Services
| Service | Purpose |
|---|---|
| [TMDB API](https://www.themoviedb.org/documentation/api) | Movie & TV show data |
| [MongoDB Atlas](https://cloud.mongodb.com) | Cloud database |
| [Firebase Auth](https://firebase.google.com/products/auth) | Google Sign-In |

---

## 📁 Project Structure

```
MovieFlix/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, Movie, Banner, Row, MovieModal…
│   │   ├── pages/           # Home, Movies, TVShows, Search, Watchlist…
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── requests.js      # TMDB API URL helpers
│   │   ├── api.js           # Backend base URL config
│   │   └── tests/           # Vitest unit tests
│   └── vite.config.js
│
└── server/                  # Node/Express backend
    ├── models/
    │   └── User.js          # Mongoose user schema (watchlist, likes)
    ├── routes/
    │   └── userRoutes.js    # /api/user endpoints
    └── server.js
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- TMDB API key → [get one free](https://www.themoviedb.org/settings/api)
- Firebase project → [console.firebase.google.com](https://console.firebase.google.com)

### 1. Clone the repo
```bash
git clone [https://github.com/Abhilash777gowda/MovieFlix.git](https://github.com/Abhilash777gowda/MovieFlix.git)
cd MovieFlix
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create [server/.env](cci:7://file:///c:/Users/abhil/Desktop/MovieFlix/server/.env:0:0-0:0):
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/movieflix
PORT=5000
```

```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_TMDB_KEY=your_tmdb_api_key
VITE_API_URL=http://localhost:5000
```

Add your Firebase config to `src/firebase.js`.

```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## 🧪 Running Tests

```bash
# Frontend unit tests (Vitest)
cd client
npm test

# Backend API tests (Jest + Supertest)
cd server
npm test
```

---

## 📦 Deployment

| Service | URL |
|---|---|
| Frontend (Vercel) | `https://your-app.vercel.app` |
| Backend (Render) | `https://your-api.onrender.com` |

Set `VITE_API_URL` on Vercel to point to your Render backend URL.

---

## 📸 Screenshots

> _Add screenshots of your app here_

---

## 📄 License

MIT © [Abhilash Gowda](https://github.com/Abhilash777gowda)
