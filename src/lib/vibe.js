
/** Slider level → a mood label + keyword seeds. */
export function describeVibe(level) {
  if (level <= 20) return { label: 'Mellow Drift', keywords: ['chill acoustic', 'ambient lofi'] };
  if (level <= 40) return { label: 'Window Seat', keywords: ['indie folk', 'soft pop'] };
  if (level <= 60) return { label: 'City Stroll', keywords: ['feel good indie', 'groove'] };
  if (level <= 80) return { label: 'Golden Hour', keywords: ['upbeat pop', 'summer anthems'] };
  return { label: 'Full Send', keywords: ['dance party', 'club bangers'] };
}

/** Live weather → a flavor phrase mixed into one of the queries. */
export function weatherFlavor(condition, tempF) {
  const c = (condition || '').toLowerCase();
  if (c.includes('thunder')) return 'stormy night';
  if (c.includes('rain') || c.includes('drizzle')) return 'rainy day';
  if (c.includes('snow')) return 'cozy winter';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'dreamy';
  if (c.includes('cloud')) return tempF < 55 ? 'moody overcast' : 'daydream';
  if (tempF >= 85) return 'summer heat';
  if (tempF <= 40) return 'winter chill';
  return 'sunny day';
}


export function buildQueries({ vibeLevel, condition, tempF, countryName }) {
  const vibe = describeVibe(vibeLevel);
  const flavor = weatherFlavor(condition, tempF);

  return {
    label: vibe.label,
    queries: [
      vibe.keywords[0],
      `${flavor} ${vibe.keywords[1]}`.trim(),
      `${countryName} music`,
    ],
  };
}

export function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
}
