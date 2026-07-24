import { Link, useNavigate, useParams } from 'react-router-dom';
import BoardingPass from '../components/BoardingPass';
import MapView from '../components/MapView';
import CountryCard from '../components/CountryCard';
import PopularityChart from '../components/charts/PopularityChart';
import DecadeChart from '../components/charts/DecadeChart';
import TrackList from '../components/TrackList';
import { useTrips } from '../context/TripsContext';
import { useAuth } from '../context/AuthContext';

/**
 * PlaylistDetail (/playlist/:id) — everything the 3 APIs produced for
 * one trip: boarding pass header, interactive map (viz #1), country
 * briefing, audio analytics charts (viz #2), and the track list.
 */
export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrip, isSaved, saveTrip, removeTrip } = useTrips();
  const { user } = useAuth();

  const trip = getTrip(id);

  // Generated playlists live in memory for the session; only saved
  // ones survive a refresh. Handle the "gone" case kindly.
  if (!trip) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-mist">
          Trip not found
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-cloud">
          This pass expired.
        </h1>
        <p className="mt-3 text-mist">
          Generated playlists last for the session unless you save them to your
          dashboard. Let's plan a new one.
        </p>
        <Link
          to="/discover"
          className="mt-8 inline-block rounded-full bg-runway px-7 py-3 font-mono text-sm font-bold uppercase tracking-widest text-night hover:bg-cloud"
        >
          Plan a trip
        </Link>
      </div>
    );
  }

  const saved = isSaved(trip.id);

  const handleSaveClick = () => {
    if (!user) {
      navigate('/auth', { state: { from: `/playlist/${trip.id}` } });
      return;
    }
    if (saved) {
      removeTrip(trip.id);
    } else {
      saveTrip(trip);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <BoardingPass
        trip={trip}
        actions={
          <button
            onClick={handleSaveClick}
            className={`rounded-full px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
              saved
                ? 'border border-radar text-radar hover:border-alert hover:text-alert'
                : 'bg-runway text-night hover:bg-cloud'
            }`}
          >
            {saved ? '✓ Saved — remove' : user ? 'Save this trip' : 'Log in to save'}
          </button>
        }
      />

      {/* Map + destination briefing */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MapView trip={trip} />
        <CountryCard trip={trip} />
      </div>

      {/* Audio analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PopularityChart tracks={trip.tracks} />
        <DecadeChart tracks={trip.tracks} />
      </div>

      {/* The playlist */}
      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-mist">
            The soundtrack — {trip.tracks.length} tracks
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mist/60">
            blended from: {trip.queries.join(' / ')}
          </p>
        </div>
        <TrackList tracks={trip.tracks} />
      </section>
    </div>
  );
}
