/**
 * DecadeChart — Recharts donut of the playlist's release decades,
 * derived from each track's album release date. Answers "is this
 * trip's soundtrack throwback or brand-new?"
 */
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#f2b33d', '#43d9ad', '#7c8cf8', '#ff7a6b', '#8e9bbd', '#e8edfb'];

export default function DecadeChart({ tracks }) {
  // { "2020s": 9, "2010s": 5, ... } → sorted array for the chart
  const counts = tracks.reduce((acc, t) => {
    if (!t.releaseYear) return acc;
    const decade = `${Math.floor(t.releaseYear / 10) * 10}s`;
    acc[decade] = (acc[decade] ?? 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade.localeCompare(b.decade));

  return (
    <section className="rounded-2xl border border-white/10 bg-cabin p-5">
      <h3 className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-mist">
        Release decades
      </h3>
      <p className="mb-4 text-xs text-mist/80">
        When this playlist's songs came out — the era mix of your trip's soundtrack.
      </p>

      <div className="flex flex-wrap items-center gap-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="decade"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                stroke="#0b1120"
              >
                {data.map((entry, i) => (
                  <Cell key={entry.decade} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1a2440',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontFamily: 'Space Mono',
                  fontSize: 12,
                }}
                itemStyle={{ color: '#e8edfb' }}
                formatter={(value, name) => [`${value} tracks`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend, departure-board style */}
        <ul className="min-w-40 flex-1 space-y-2">
          {data.map((d, i) => (
            <li key={d.decade} className="flex items-center gap-3 font-mono text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-cloud">{d.decade}</span>
              <span className="board-leader" />
              <span className="text-mist">{d.count} tracks</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
