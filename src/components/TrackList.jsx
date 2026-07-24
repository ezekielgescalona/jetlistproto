import { useRef, useState } from 'react';
import { formatDuration } from '../lib/vibe';

/**
 * TrackList — the playlist itself. Spotify search data rendered as
 * cards: album art, title/artists, year + duration, a popularity
 * meter, and an "Open in Spotify" link. If Spotify provides a 30s
 * preview URL (rare for new API apps) a play button appears too.
 */
export default function TrackList({ tracks }) {
  const audioRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  const togglePreview = (track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(track.previewUrl);
    audio.onended = () => setPlayingId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((t, i) => (
        <div
          key={t.id}
          className="pass-hover flex gap-3 rounded-xl border border-white/10 bg-cabin p-3"
        >
          <img
            src={t.albumArt}
            alt={`Album art for ${t.album}`}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate font-medium text-cloud" title={t.name}>
                <span className="mr-1.5 font-mono text-[10px] text-mist">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t.name}
              </p>
              {t.explicit && (
                <span className="rounded-sm border border-white/15 px-1 font-mono text-[9px] uppercase text-mist">
                  E
                </span>
              )}
            </div>
            <p className="truncate text-sm text-mist" title={t.artists}>
              {t.artists}
            </p>

            <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-mist">
              <span>{t.releaseYear ?? '—'}</span>
              <span>·</span>
              <span>{formatDuration(t.durationMs)}</span>
              {/* Popularity meter (Spotify's 0–100 score) */}
              <span
                className="ml-auto inline-block h-1 w-14 overflow-hidden rounded-full bg-white/10"
                title={`Popularity ${t.popularity}/100`}
              >
                <span
                  className="block h-full rounded-full bg-runway"
                  style={{ width: `${t.popularity}%` }}
                />
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
              {t.previewUrl && (
                <button
                  onClick={() => togglePreview(t)}
                  className="text-radar hover:text-cloud"
                >
                  {playingId === t.id ? '■ Stop' : '▶ Preview'}
                </button>
              )}
              <a
                href={t.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-mist underline-offset-4 hover:text-runway hover:underline"
              >
                Open in Spotify ↗
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
