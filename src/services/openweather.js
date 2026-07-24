/**
 * openweather.js — OpenWeather Current Weather API (PRIVATE / key required)
 * Docs: https://openweathermap.org/current
 *
 * Auth style: API key passed as the `appid` query parameter.
 * Free tier: 60 calls/minute — plenty for this project.
 *
 * This is API call #1 in the JetList chain. Besides weather, the
 * response gives us two things we reuse everywhere:
 *   • coord.lat / coord.lon  → centers the Leaflet map
 *   • sys.country ("JP")     → ISO code fed into the country lookup + Spotify
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getCurrentWeather(city) {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweather_api_key_here') {
    throw new Error('Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file (see API_SETUP.md), then restart the dev server.');
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=imperial&appid=${key}`;
  const res = await fetch(url); // GET request

  if (res.status === 404) {
    throw new Error(`Couldn't find "${city}" — try a city name like "Tokyo" or "Paris".`);
  }
  if (res.status === 401) {
    throw new Error('OpenWeather rejected the API key. New keys can take up to ~2 hours to activate — double-check .env and try again soon.');
  }
  if (!res.ok) {
    throw new Error(`OpenWeather error (${res.status}). Please try again.`);
  }

  const data = await res.json();

  // Return only the fields the app actually uses (keeps saved trips small).
  return {
    city: data.name,
    countryCode: data.sys?.country ?? null, // e.g. "JP" — reused downstream!
    tempF: Math.round(data.main.temp),
    feelsLikeF: Math.round(data.main.feels_like),
    condition: data.weather?.[0]?.main ?? 'Clear',        // e.g. "Rain"
    description: data.weather?.[0]?.description ?? '',    // e.g. "light rain"
    icon: data.weather?.[0]?.icon ?? '01d',               // OpenWeather icon code
    humidity: data.main.humidity,
    windMph: Math.round(data.wind?.speed ?? 0),
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}

/** Official OpenWeather icon URL (no key needed for icons). */
export function weatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
