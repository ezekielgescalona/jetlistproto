# 🔑 API Setup Guide — getting all three JetList APIs working

This guide walks through obtaining credentials for each API, wiring them into
the app, and proving they work (including the screenshots you need for the
checkpoint). Total time: ~15 minutes of clicking, plus one possible wait for
OpenWeather key activation.

| API | Auth type | Cost | What you need |
|---|---|---|---|
| Country facts dataset | None — public & keyless | Free | Nothing 🎉 |
| OpenWeather | API key (query param) | Free tier | 1 key |
| Spotify | OAuth 2.0 client credentials | Free | Client ID + Client Secret |

---

## 1. Country facts — no signup needed (⚠️ no longer restcountries.com)

This project originally called the RESTCountries API directly. **As of this
project's development, restcountries.com 301-redirects every endpoint —
`/v3.1/alpha/{code}`, `/v3.1/name/{name}`, even the old `/v2/` routes — to a
static file host (`files-03.restcountries.com`) that sends no
`Access-Control-Allow-Origin` header at all.** `curl`/Node scripts don't
notice because they aren't subject to CORS, but every browser blocks the
redirected response, so any frontend calling restcountries.com directly will
fail with a CORS error the moment it tries to fetch country data.

**The fix:** `src/services/restcountries.js` now fetches the same underlying
data straight from its source — the [mledoze/countries](https://github.com/mledoze/countries)
dataset on GitHub, which restcountries.com itself is built from. GitHub's raw
content host does send CORS headers, so it works from the browser:

**Try it right now** — paste this in your browser:

```
https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json
```

You'll get one big JSON array of every country. Since it's not queryable by
code, `restcountries.js` fetches it once per session, caches it in memory,
and finds the matching entry by `cca2` (the ISO code OpenWeather gives us,
like `JP`) client-side.

Two things worth mentioning in your presentation:
- **Two fields didn't survive the swap.** This dataset has no `population`
  field (dropped from the UI entirely — `CountryCard` no longer shows that
  row) and no flag image URL (only a flag emoji) — so the flag image is
  built manually from `https://flagcdn.com/w320/{code}.png`, the same CDN
  restcountries.com's own `flags.png` field pointed to.
- **This is a great real-world CORS story for Q&A.** It's a live example of
  "the API worked when I tested it with curl, then broke in the browser" —
  worth explaining CORS preflight/redirect behavior if asked.

---

## 2. OpenWeather — one key, one gotcha

### Get the key
1. Go to **https://home.openweathermap.org/users/sign_up** and create a free
   account (student use counts as personal/non-commercial).
2. Confirm the verification email they send you.
3. Once logged in, open **https://home.openweathermap.org/api_keys** (or click
   your username → *My API keys*).
4. A key named **Default** already exists — copy it. (You can also generate a
   fresh one named `jetlist`.)

### ⚠️ The gotcha
New keys take a while to activate — usually 10–30 minutes, officially "up to
2 hours." Until then every call returns **401 Unauthorized**, even though your
key is correct. If you get a 401 right after signing up: wait, don't debug.

### Wire it in
Open your `.env` (create it with `cp .env.example .env` if you haven't) and
paste:

```
VITE_OPENWEATHER_API_KEY=paste_your_key_here
```

Restart the dev server (`Ctrl+C`, then `npm run dev`) — Vite only reads `.env`
on startup.

### Prove it works
Paste this in a browser tab (with your real key):

```
https://api.openweathermap.org/data/2.5/weather?q=Fullerton&units=imperial&appid=YOUR_KEY
```

JSON with `main.temp`, `weather[0].description`, `coord`, and `sys.country`
means you're live. Free tier limit: **60 calls/minute** — JetList uses 1 call
per playlist, so you'll never get close.

---

## 3. Spotify — Client ID + Secret

### Create the app
1. Go to **https://developer.spotify.com/dashboard** and log in (a normal free
   Spotify account works — Premium not required).
2. Accept the developer terms if prompted, then click **Create app**.
3. Fill in the form:
   - **App name:** `JetList`
   - **App description:** `CPSC-349 class project — destination playlist generator`
   - **Redirect URI:** `http://127.0.0.1:5173/callback`
     - The field is required even though our server-to-server flow never
       actually redirects. Use `127.0.0.1`, **not** the word `localhost` —
       Spotify's newer rules reject plain `localhost` URIs.
   - **Which API/SDKs are you planning to use?** check **Web API**.
4. Save, then open your app → **Settings**.
5. Copy the **Client ID**. Click **View client secret** and copy that too.

### Wire it in
```
VITE_SPOTIFY_CLIENT_ID=paste_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=paste_client_secret_here
```

Restart the dev server again.

### How the auth actually works (know this for the Q&A!)
Spotify uses **OAuth 2.0**, not a simple key. JetList uses the **client
credentials flow**, which happens in `src/services/spotify.js`:

1. `POST https://accounts.spotify.com/api/token` with a
   `Authorization: Basic base64(client_id:client_secret)` header and body
   `grant_type=client_credentials`.
2. Spotify returns an `access_token` valid for **1 hour** (`expires_in: 3600`).
   The app caches it in memory and reuses it until ~1 minute before expiry.
3. Every search then sends `Authorization: Bearer <token>` to
   `GET https://api.spotify.com/v1/search`.

This flow grants app-level access (search, track/album/artist data). It cannot
touch a specific user's library — that would need the authorization-code flow
with a real redirect.

### ⚠️ Two Spotify facts to say out loud in your presentation
1. **Deprecated endpoints.** Apps created after **Nov 27, 2024** get `403` from
   `/recommendations`, `/audio-features`, and `/audio-analysis` — Spotify
   closed them to new apps with no replacement. That's why JetList generates
   playlists via the **Search** endpoint (blending mood + weather + local
   queries, biased by the `market` country code) and charts **popularity,
   release decades, and durations** instead of acoustic features. Knowing this
   shows you researched the real, current API surface.
2. **The client secret is in frontend code — and that's a known tradeoff.**
   Anything in a `VITE_` variable is baked into the JS bundle, so a determined
   visitor could extract the secret from DevTools. Acceptable for a class
   demo; in production you'd move the token exchange into a tiny backend
   (e.g., a Vercel serverless function) so the secret never ships to the
   browser. Saying this unprompted is an easy way to score security points.

Rate limits: Spotify uses a rolling ~30-second window. If you ever see `429`,
the response's `Retry-After` header says how many seconds to wait. JetList's
3 searches per playlist won't trigger it in normal use.

---

## 4. Checkpoint screenshots — exactly what to capture

1. Run `npm run dev`, open the app, and generate a playlist (e.g., Tokyo,
   vibe 80).
2. Open DevTools (`F12` or `Cmd+Option+I`) → **Network** tab → filter
   **Fetch/XHR**. Generate again so the requests appear.
3. You'll see the whole chain — click each and screenshot the **Headers**
   (shows method + URL) and **Response** (shows the JSON) panes:
   - `weather?q=Tokyo…` — **GET**, OpenWeather (blur or crop your `appid` key!)
   - `countries.json` — **GET**, the country facts dataset (only fires once
     per session — it's cached in memory, so generate a *fresh* tab reload
     first if you don't see it)
   - `token` — **POST**, Spotify auth (the response shows `access_token`)
   - `search?q=…` — **GET**, Spotify with the Bearer token

One screenshot showing method + endpoint URL + JSON response satisfies the
checkpoint requirement; capturing the POST `token` call is a nice flex since
most teams only show GETs.

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| OpenWeather `401` | Key not active yet, or typo | Wait up to ~2h for activation; re-copy the key |
| `Couldn't find "…"` | City name OpenWeather doesn't know | Try `City,CountryCode` format, e.g. `Springfield,US` |
| CORS error fetching country data | You're hitting restcountries.com directly instead of the GitHub dataset | Use `src/services/restcountries.js` as-is — see section 1 |
| Spotify `400 invalid_client` | Wrong ID/secret, or spaces pasted into `.env` | Re-copy both values, no quotes, no trailing spaces |
| Spotify `403` on some endpoint | You called a deprecated endpoint (recommendations / audio-features) | Use search — see section 3 |
| Changed `.env` but nothing happens | Vite reads env only at startup | Restart `npm run dev` |
| Keys undefined in code | Variable missing the `VITE_` prefix | Only `VITE_`-prefixed vars reach the browser |
| Works locally, fails on Vercel | Env vars not set in Vercel | Project → Settings → Environment Variables, then redeploy |
