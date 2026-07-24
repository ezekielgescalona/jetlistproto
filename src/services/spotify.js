/**
 * spotify.js — Spotify Web API (PRIVATE / OAuth client credentials)
 * Docs: https://developer.spotify.com/documentation/web-api
 *
 * Auth style: OAuth 2.0 "Client Credentials" flow —
 *   1. POST our Client ID + Secret to accounts.spotify.com  → access token
 *   2. GET api.spotify.com/v1/search with "Authorization: Bearer <token>"
 * Tokens last 1 hour; we cache one and reuse it until it expires.
 *
 * ⚠️ Classroom shortcut: the client secret lives in frontend .env here,
 * which means it ships in the JS bundle. Fine for a class demo — in a
 * real product you'd do this exchange in a tiny backend/serverless
 * function so the secret never reaches the browser. (See API_SETUP.md.)
 *
 * ⚠️ Deprecated endpoints: Spotify shut off /recommendations,
 * /audio-features, and /audio-analysis for apps created after
 * Nov 27, 2024 (they 403). JetList therefore builds playlists with
 * the Search endpoint, and charts fields Search DOES return:
 * popularity, release dates, and durations.
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

// Simple in-memory token cache: { token, expiresAt }
let cached = { token: null, expiresAt: 0 };

async function getAccessToken() {
  const id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  if (!id || !secret || id === 'your_spotify_client_id_here') {
    throw new Error('Missing Spotify credentials. Add VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET to .env (see API_SETUP.md), then restart the dev server.');
  }

  // Reuse the cached token if it still has >60s of life left.
  if (cached.token && Date.now() < cached.expiresAt - 60_000) {
    return cached.token;
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST', // ← the POST request for your checkpoint screenshot!
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${id}:${secret}`),
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error('Spotify auth failed — double-check your Client ID and Client Secret in .env.');
  }

  const data = await res.json();
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000, // expires_in = 3600s
  };
  return cached.token;
}

/** Trim Spotify's big track object down to just what the UI needs. */
function toTrack(t) {
  return {
    id: t.id,
    name: t.name,
    artists: t.artists.map((a) => a.name).join(', '),
    album: t.album?.name ?? '',
    albumArt: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? '',
    releaseYear: Number((t.album?.release_date ?? '').slice(0, 4)) || null,
    durationMs: t.duration_ms,
    popularity: t.popularity ?? 0, // 0–100, Spotify's own metric
    explicit: t.explicit,
    spotifyUrl: t.external_urls?.spotify ?? '',
    previewUrl: t.preview_url ?? null, // usually null for new API apps
  };
}

/** GET /v1/search — find tracks for one query. `market` = ISO code like "JP". */
export async function searchTracks(query, { market, limit = 10 } = {}) {
  const token = await getAccessToken();
  const params = new URLSearchParams({ q: query, type: 'track', limit: String(limit) });
  if (market) params.set('market', market);

  const res = await fetch(`${API_URL}/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429) {
    throw new Error('Spotify rate limit hit — wait a few seconds and try again.');
  }
  if (!res.ok) {
    throw new Error(`Spotify search error (${res.status}).`);
  }

  const data = await res.json();
  return (data.tracks?.items ?? []).map(toTrack);
}

/**
 * Run every query in parallel, then interleave the result lists
 * (mood, weather, local) round-robin style so the playlist blends
 * all three angles instead of clumping. De-dupes by track id.
 */
export async function generatePlaylist({ queries, market, size = 18 }) {
  const lists = await Promise.all(
    queries.map((q) => searchTracks(q, { market, limit: 10 }))
  );

  const seen = new Set();
  const mixed = [];
  const longest = Math.max(...lists.map((l) => l.length), 0);

  for (let i = 0; i < longest; i++) {
    for (const list of lists) {
      const t = list[i];
      if (t && t.albumArt && !seen.has(t.id)) {
        seen.add(t.id);
        mixed.push(t);
      }
    }
  }

  if (mixed.length === 0) {
    throw new Error('Spotify returned no tracks for this vibe — try a different city or vibe level.');
  }
  return mixed.slice(0, size);
}
