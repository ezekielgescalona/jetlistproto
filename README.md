# ✈️ Destination Playlist Generator - JetList

## 📖 Project Overview
When traveling, people often want to experience new things. This application helps travelers break out of their musical comfort zones by discovering new music tied to the memories they make on their trips. Users simply input their travel destination, and the application generates a tailored playlist perfectly suited to that location's specific "vibe."

This project was built to demonstrate front-end engineering skills and fulfills the requirements for CPSC-349: Web Frontend Engineering.

🔗 **Live Demo:** [Add your Vercel URL here after deploying]

## ✨ Core Features
* **Secure User Authentication & Dashboard:** Allows users to sign up, log in, log out, and maintain user-specific state to view saved trips, backed by **Firebase Authentication** and **Firestore** (saved trips sync live per-account instead of living in localStorage).
* **Interactive Destination & Vibe Selector:** A form allowing users to input travel plans with an interactive slide bar to determine how much "vibe" they want.
* **Responsive Player UI:** A fully adaptable layout built with Tailwind CSS and Flexbox/Grid that is usable on desktop, tablet, and mobile screens.
* **Boarding Pass Trips:** Every generated playlist renders as a boarding pass — complete with a "barcode" whose bars encode each track's real Spotify popularity score.

## 🛠️ Technology Stack
* **Frontend:** React 19 & Vite
* **Styling:** Tailwind CSS v4
* **Routing:** React Router (5 client-side routes)
* **Visualizations:** Leaflet + react-leaflet (map), Recharts (charts)
* **Deployment:** Vercel

## 🔌 API Integration
This application integrates 3 distinct APIs and meaningfully incorporates their data into the user interface:
* **Country facts dataset (Public/Keyless):** Fetches regional destination details such as local languages and currencies, shown in the Destination Briefing card and used to add local flavor to playlist searches. Originally sourced from the RESTCountries API, but restcountries.com now 301-redirects every endpoint to a static host with no CORS support, breaking it for browser use — JetList instead fetches the same underlying [mledoze/countries](https://github.com/mledoze/countries) dataset directly from GitHub (`raw.githubusercontent.com`, which does send CORS headers). See `src/services/restcountries.js` for details.
* **Spotify Web API (Private/Authenticated):** The core engine requiring OAuth (client credentials flow) that fetches song data and generates customized travel playlists. Because Spotify deprecated the `/recommendations` and `/audio-features` endpoints for apps created after Nov 27, 2024, JetList builds playlists through the **Search** endpoint — blending mood, weather, and local-flavor queries — and charts data Search still returns (popularity, release dates, durations).
* **OpenWeather API (Private/Authenticated):** Pulls real-time weather data for the destination to help calculate and tailor the musical vibe. Its response also supplies the coordinates for the map and the country code that links all three APIs together.

**The API chain:** OpenWeather (city → weather + coords + country code) → country facts dataset (code → country facts) → Spotify (vibe × weather × country → tracks).

## 🗺️ Application Routes
The application utilizes client-side navigation to support 5 fully functional routes:
* **`/` (Home/Landing Page):** Introduction to the application and a call-to-action to start planning.
* **`/discover` (Search/Explore Page):** The interactive destination form and vibe selector where users input their travel parameters.
* **`/playlist/:id` (Detail Page):** Displays the generated playlist, the interactive route map, and audio analytics for the selected trip.
* **`/dashboard` (Saved Items Page):** A personalized view for authenticated users to manage their saved travel playlists and history. *(Protected route — requires login.)*
* **`/auth` (Settings/Profile Page):** Secure login and sign-up forms for user authentication.

## 📊 Data Visualizations
To help users understand the data, the application includes 2 forms of interactive visualization:
* **Interactive Route Map:** Built with Leaflet (dark CARTO basemap) to visually map out the travel destination, centered on live coordinates from OpenWeather.
* **Audio Analytics Charts:** Built with Recharts — a track-popularity bar chart and a release-decade donut chart summarizing the playlist's makeup.

## 🚀 Setup Instructions
To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [Your-GitHub-Repo-URL]
   cd jetlist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file and add your API keys (see **API_SETUP.md** for a step-by-step guide to getting each key):
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_OPENWEATHER_API_KEY=your_key
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   *(The country facts dataset needs no key.)*

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open the printed URL (usually `http://localhost:5173`). **Note:** Vite only reads `.env` at startup — restart the server after changing keys.

## ☁️ Deployment (Vercel)
1. Push the repo to GitHub (make sure `.env` is **not** committed — it's in `.gitignore`).
2. In [vercel.com](https://vercel.com), click **Add New → Project** and import the repo. Vercel auto-detects Vite.
3. Under **Settings → Environment Variables**, add the same `VITE_` variables from your `.env`.
4. Deploy. The included `vercel.json` rewrite makes React Router routes (like `/playlist/abc`) work on refresh.
5. Paste the live URL at the top of this README. ✅

## 📁 Project Structure
```
src/
├── pages/          # One component per route (Home, Discover, PlaylistDetail, Dashboard, Auth)
├── components/     # Reusable UI (Navbar, BoardingPass, VibeSlider, MapView, TrackList…)
│   └── charts/     # Recharts visualizations
├── services/       # One file per API (openweather.js, restcountries.js, spotify.js)
├── context/        # AuthContext (Firebase Auth) + TripsContext (session + Firestore-synced saved trips)
└── lib/            # firebase.js (app/auth/db init) + vibe.js (slider + weather → search queries)
```

