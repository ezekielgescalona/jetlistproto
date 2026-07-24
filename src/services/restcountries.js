/**
 * restcountries.js — country facts (PUBLIC / no key needed)
 *
 * ⚠️ restcountries.com itself now 301-redirects every endpoint (v3.1 AND
 * the old v2) to a static file host with no CORS headers, which makes it
 * unusable from any browser. We source the same underlying data instead
 * from the mledoze/countries dataset on GitHub — restcountries.com is
 * literally built from this dataset, so the field shapes match closely.
 * raw.githubusercontent.com serves it with `Access-Control-Allow-Origin: *`.
 *
 * Two fields restcountries.com had aren't in this dataset:
 *   - population: dropped from the UI (CountryCard no longer shows it).
 *   - flag image: this dataset only has a flag emoji, not a PNG URL, so
 *     we build the image URL ourselves from flagcdn.com (the same CDN
 *     restcountries.com's own `flags.png` field pointed to).
 *
 * It's one big JSON array (~250 countries), so we fetch it once per
 * session and cache it in memory instead of re-fetching per lookup.
 */

const DATASET_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json';

let cachedCountries = null;

async function loadCountries() {
  if (cachedCountries) return cachedCountries;

  const res = await fetch(DATASET_URL); // GET request — no key, no headers!
  if (!res.ok) {
    throw new Error(`Couldn't load the country dataset (${res.status}).`);
  }
  cachedCountries = await res.json();
  return cachedCountries;
}

export async function getCountryByCode(code) {
  if (!code) throw new Error('No country code to look up.');

  const countries = await loadCountries();
  const d = countries.find((c) => c.cca2 === code.toUpperCase());
  if (!d) {
    throw new Error(`Couldn't find country code "${code}".`);
  }

  return {
    code: d.cca2 ?? code,
    name: d.name?.common ?? code,
    officialName: d.name?.official ?? '',
    capital: d.capital?.[0] ?? '—',
    region: d.region ?? '—',
    subregion: d.subregion ?? '',
    languages: Object.values(d.languages ?? {}),                    // ["Japanese"]
    currencies: Object.values(d.currencies ?? {}).map(
      (c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`         // ["Japanese yen (¥)"]
    ),
    flagPng: `https://flagcdn.com/w320/${(d.cca2 ?? code).toLowerCase()}.png`,
    flagAlt: `Flag of ${d.name?.common ?? code}`,
    lat: d.latlng?.[0] ?? null,
    lng: d.latlng?.[1] ?? null,
  };
}
