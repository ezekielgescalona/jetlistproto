/**
 * CountryCard — country facts rendered as a destination briefing
 * (languages, currency, capital), plus the live weather detail from
 * OpenWeather. This is where the two "context" APIs show up meaningfully
 * in the UI instead of as raw JSON.
 */

function Row({ label, children }) {
  return (
    <div className="flex items-baseline gap-3 py-2.5">
      <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
        {label}
      </span>
      <span className="board-leader" />
      <span className="text-right text-sm text-cloud">{children}</span>
    </div>
  );
}

export default function CountryCard({ trip }) {
  const { country, weather } = trip;

  return (
    <section className="rounded-2xl border border-white/10 bg-cabin p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-mist">
          Destination briefing
        </h3>
        {country.flagPng && (
          <img
            src={country.flagPng}
            alt={country.flagAlt}
            className="h-5 w-8 rounded-[3px] object-cover"
          />
        )}
      </div>

      <div className="divide-y divide-white/5">
        <Row label="Country">{country.name}</Row>
        <Row label="Capital">{country.capital}</Row>
        <Row label="Region">
          {country.region}
          {country.subregion ? ` — ${country.subregion}` : ''}
        </Row>
        <Row label="Languages">{country.languages.join(', ') || '—'}</Row>
        <Row label="Currency">{country.currencies.join(', ') || '—'}</Row>
        <Row label="Right now">
          <span className="text-radar">
            {weather.tempF}°F · {weather.description}
          </span>
        </Row>
        <Row label="Feels like">
          {weather.feelsLikeF}°F · {weather.humidity}% humidity · {weather.windMph} mph wind
        </Row>
      </div>
    </section>
  );
}
