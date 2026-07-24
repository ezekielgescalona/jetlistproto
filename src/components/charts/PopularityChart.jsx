/**
 * PopularityChart — Recharts bar chart of each track's Spotify
 * popularity score (0–100). Part of visualization #2 (audio
 * analytics). Uses fields the Search endpoint still returns, since
 * Spotify's audio-features endpoint is closed to new apps.
 */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const shorten = (s, n = 12) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export default function PopularityChart({ tracks }) {
  const data = tracks.map((t) => ({
    name: shorten(t.name),
    full: t.name,
    popularity: t.popularity,
  }));

  return (
    <section className="rounded-2xl border border-white/10 bg-cabin p-5">
      <h3 className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-mist">
        Track popularity
      </h3>
      <p className="mb-4 text-xs text-mist/80">
        Spotify's 0–100 score for every track on this pass — taller bars are bigger hits.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 4 }}>
            <CartesianGrid stroke="rgba(142,155,189,0.12)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#8e9bbd', fontSize: 10, fontFamily: 'Space Mono' }}
              interval={0}
              angle={-38}
              height={70}
              textAnchor="end"
              tickLine={false}
              axisLine={{ stroke: 'rgba(142,155,189,0.25)' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#8e9bbd', fontSize: 10, fontFamily: 'Space Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(232,237,251,0.05)' }}
              contentStyle={{
                background: '#1a2440',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontFamily: 'Space Mono',
                fontSize: 12,
              }}
              labelStyle={{ color: '#e8edfb' }}
              itemStyle={{ color: '#f2b33d' }}
              formatter={(value) => [`${value}/100`, 'popularity']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.full ?? label}
            />
            <Bar dataKey="popularity" fill="#f2b33d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
