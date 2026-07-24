import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VibeSlider from '../components/VibeSlider';
import { getCurrentWeather } from '../services/openweather';
import { getCountryByCode } from '../services/restcountries';
import { generatePlaylist } from '../services/spotify';
import { buildQueries } from '../lib/vibe';
import { useTrips } from '../context/TripsContext';

/**
 * Discover — the check-in desk. This page runs the full 3-API chain:
 *   1. OpenWeather        → live conditions + coordinates + country code
 *   2. mledoze/countries  → country facts from that code (see restcountries.js
 *                           for why this replaced restcountries.com)
 *   3. Spotify            → tracks matching vibe × weather × local flavor
 * then hands the finished trip to /playlist/:id.
 */

const PHASES = {
  weather: 'Checking the weather',
  country: 'Reading the destination briefing',
  music: 'Curating your soundtrack',
};

export default function Discover() {
  const [city, setCity] = useState('');
  const [vibeLevel, setVibeLevel] = useState(60);
  const [phase, setPhase] = useState(null); // null | 'weather' | 'country' | 'music'
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addSessionTrip } = useTrips();

  const generating = phase !== null;

  async function handleGenerate(e) {
    e.preventDefault();
    if (!city.trim() || generating) return;
    setError('');

    try {
      // 1️⃣ OpenWeather (private API — key in .env)
      setPhase('weather');
      const weather = await getCurrentWeather(city.trim());

      // 2️⃣ Country facts (public keyless dataset — see restcountries.js)
      setPhase('country');
      const country = await getCountryByCode(weather.countryCode);

      // 3️⃣ Spotify (private API — OAuth client credentials)
      setPhase('music');
      const plan = buildQueries({
        vibeLevel,
        condition: weather.condition,
        tempF: weather.tempF,
        countryName: country.name,
      });
      const tracks = await generatePlaylist({
        queries: plan.queries,
        market: country.code,
      });

      const trip = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        destination: weather.city,
        vibeLevel,
        vibeLabel: plan.label,
        queries: plan.queries,
        weather,
        country,
        tracks,
      };

      addSessionTrip(trip);
      navigate(`/playlist/${trip.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong — please try again.');
      setPhase(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-radar">
        Check-in desk
      </p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl">
        Where to?
      </h1>
      <p className="mt-3 text-mist">
        One city, one slider. JetList handles the weather report, the country
        briefing, and the soundtrack.
      </p>

      <form
        onSubmit={handleGenerate}
        className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-cabin p-6 sm:p-8"
      >
        <div>
          <label
            htmlFor="city"
            className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-mist"
          >
            Destination city
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Tokyo, Paris, Nairobi…"
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-night px-4 py-3.5 font-display text-xl text-cloud placeholder:text-mist/50 focus:border-runway focus:outline-none"
          />
        </div>

        <VibeSlider value={vibeLevel} onChange={setVibeLevel} />

        <button
          type="submit"
          disabled={generating || !city.trim()}
          className="w-full rounded-full bg-runway py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-night transition-colors hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-40"
        >
          {generating ? 'Generating…' : 'Generate my playlist'}
        </button>

        {/* Staged status board while the 3 APIs run in sequence */}
        {generating && (
          <div className="space-y-2 rounded-xl border border-white/10 bg-night p-4 font-mono text-xs uppercase tracking-[0.2em]">
            {Object.entries(PHASES).map(([key, label]) => {
              const order = Object.keys(PHASES);
              const done = order.indexOf(key) < order.indexOf(phase);
              const active = key === phase;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 ${
                    done ? 'text-radar' : active ? 'text-cloud' : 'text-mist/40'
                  }`}
                >
                  <span>{done ? '✓' : active ? '▸' : '·'}</span>
                  <span className={active ? 'blink' : ''}>{label}…</span>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-alert/30 bg-alert/10 p-4 text-sm text-alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
