import { weatherIconUrl } from '../services/openweather';

/**
 * BoardingPass — JetList's signature UI element.
 * Every generated trip renders as a boarding pass: display-type city
 * name, mono data fields, a perforated tear line, and a "barcode"
 * whose bar heights are the real Spotify popularity score (0–100)
 * of each track — the playlist literally encoded into the pass.
 *
 * variant="full" → big header on the playlist page
 * variant="card" → compact tile on the dashboard
 */

function TrackBarcode({ tracks, tall = false }) {
  return (
    <div className="flex items-end gap-[3px]" aria-hidden="true" title="Each bar = one track's Spotify popularity">
      {tracks.map((t) => (
        <span
          key={t.id}
          className="w-[3px] rounded-sm bg-cloud/80"
          style={{ height: `${(tall ? 12 : 8) + Math.round(t.popularity * (tall ? 0.3 : 0.2))}px` }}
        />
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{label}</div>
      <div className="mt-0.5 font-mono text-sm text-cloud">{children}</div>
    </div>
  );
}

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function BoardingPass({ trip, variant = 'full', actions = null }) {
  const compact = variant === 'card';

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-cabin ${
        compact ? 'pass-hover' : ''
      }`}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
        <span>Jetlist ✈ boarding pass</span>
        <span>trip-{trip.id.slice(0, 6)}</span>
      </div>

      {/* Main section */}
      <div className={`px-5 ${compact ? 'py-4' : 'py-6'}`}>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <h2
              className={`font-display font-bold tracking-tight text-cloud ${
                compact ? 'text-2xl' : 'text-4xl sm:text-5xl'
              }`}
            >
              {trip.destination}
            </h2>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-mist">
              {trip.country.flagPng && (
                <img
                  src={trip.country.flagPng}
                  alt={trip.country.flagAlt}
                  className="h-3.5 w-6 rounded-[2px] object-cover"
                />
              )}
              <span>
                {trip.country.name} · {trip.country.region}
              </span>
            </div>
          </div>

          <div className={`grid gap-x-8 gap-y-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
            <Field label="Date">{fmtDate(trip.createdAt)}</Field>
            <Field label="Vibe">
              <span className="text-runway">{String(trip.vibeLevel).padStart(3, '0')}</span>
            </Field>
            <Field label="Temp">
              <span className="text-radar">{trip.weather.tempF}°F</span>
            </Field>
            <Field label="Sky">
              <span className="inline-flex items-center gap-1">
                <img
                  src={weatherIconUrl(trip.weather.icon)}
                  alt={trip.weather.description}
                  className="-my-2 h-7 w-7"
                />
                {trip.weather.condition}
              </span>
            </Field>
          </div>
        </div>
      </div>

      {/* Perforated tear line with side notches */}
      <div className="relative">
        <div className="mx-5 border-t-2 border-dashed border-white/10" />
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-night" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-night" />
      </div>

      {/* Stub: barcode + summary + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-end gap-3">
          <TrackBarcode tracks={trip.tracks} tall={!compact} />
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
            {trip.tracks.length} tracks · {trip.vibeLabel}
          </div>
        </div>
        {actions}
      </div>
    </article>
  );
}
