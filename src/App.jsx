import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Discover from './pages/Discover';
import PlaylistDetail from './pages/PlaylistDetail';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

/**
 * The 5 required routes:
 *   /              Home / landing
 *   /discover      Search + vibe selector
 *   /playlist/:id  Detail page (map, charts, tracks)
 *   /dashboard     Saved trips (login required)
 *   /auth          Log in / sign up
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>

      <footer className="border-t border-white/5 py-6">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
          Jetlist · CPSC-349 · React + Vite + Tailwind · mledoze/countries / OpenWeather / Spotify
        </p>
      </footer>
    </div>
  );
}
