import { Link } from 'react-router-dom';

/** Sample rows for the departure board — mirrors real app output. */
const board = [
  { dest: 'Tokyo', wx: '72°F Clear', vibe: '080 · Full Send', status: 'Now boarding', live: true },
  { dest: 'Reykjavík', wx: '38°F Snow', vibe: '015 · Mellow Drift', status: 'On time' },
  { dest: 'Rio de Janeiro', wx: '88°F Sunny', vibe: '095 · Full Send', status: 'On time' },
  { dest: 'Paris', wx: '61°F Rain', vibe: '045 · Window Seat', status: 'On time' },
];

const steps = [
  {
    n: '01',
    title: 'Pick a city',
    body: 'Type any destination. Live weather (OpenWeather) and country facts set the scene.',
  },
  {
    n: '02',
    title: 'Set the vibe',
    body: 'Slide from mellow drift to full send. Your level plus the sky outside shapes the sound.',
  },
  {
    n: '03',
    title: 'Press play',
    body: 'Spotify search blends mood, weather, and local flavor into a boarding pass you can save.',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* ── Hero ── */}
      <section className="pb-14 pt-16 sm:pb-20 sm:pt-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-radar">
          Destination radio — now boarding
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-cloud sm:text-7xl">
          Land with a<br />
          <span className="text-runway">soundtrack.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-mist">
          Tell JetList where you're headed. It reads the live weather, learns the
          local scene, and builds a playlist tuned to your vibe — before your
          seatbelt light turns off.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/discover"
            className="rounded-full bg-runway px-7 py-3 font-mono text-sm font-bold uppercase tracking-widest text-night transition-colors hover:bg-cloud"
          >
            Plan a trip
          </Link>
          <a
            href="#how"
            className="rounded-full border border-white/15 px-7 py-3 font-mono text-sm uppercase tracking-widest text-mist transition-colors hover:border-runway hover:text-runway"
          >
            How it works
          </a>
        </div>
      </section>

      {/* ── Departure board ── */}
      <section className="rounded-2xl border border-white/10 bg-cabin p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
          <span>Departures / sample vibes</span>
          <span className="hidden sm:inline">JL · gate 349</span>
        </div>
        <div className="divide-y divide-white/5">
          {board.map((row) => (
            <div
              key={row.dest}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 font-mono text-sm"
            >
              <span className="w-40 font-bold uppercase tracking-wider text-runway">
                {row.dest}
              </span>
              <span className="text-mist">{row.wx}</span>
              <span className="board-leader hidden sm:block" />
              <span className="text-cloud">{row.vibe}</span>
              <span className="board-leader hidden sm:block" />
              <span
                className={`flex items-center gap-2 uppercase tracking-wider ${
                  row.live ? 'text-radar' : 'text-mist'
                }`}
              >
                {row.live && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-radar" />}
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="grid gap-5 py-16 sm:grid-cols-3 sm:py-20">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-white/10 bg-cabin p-6">
            <div className="font-mono text-xs text-runway">{s.n}</div>
            <h3 className="mt-3 font-display text-xl font-bold text-cloud">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
