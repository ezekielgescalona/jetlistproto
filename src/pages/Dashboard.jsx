import { Link } from 'react-router-dom';
import BoardingPass from '../components/BoardingPass';
import { useTrips } from '../context/TripsContext';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard (/dashboard, login required) — the user's wallet of saved
 * boarding passes, plus summary cards (trips, tracks, countries).
 * Persistence: localStorage today, Firestore next week.
 */

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-cabin px-5 py-4">
      <div className="font-display text-3xl font-bold text-runway">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
        {label}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { savedTrips, removeTrip } = useTrips();

  const totalTracks = savedTrips.reduce((sum, t) => sum + t.tracks.length, 0);
  const countries = new Set(savedTrips.map((t) => t.country.code)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-radar">
        Frequent flyer
      </p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-cloud">
        {user.name}'s trips
      </h1>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Stat label="Saved trips" value={savedTrips.length} />
        <Stat label="Tracks collected" value={totalTracks} />
        <Stat label="Countries" value={countries} />
      </div>

      {savedTrips.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-12 text-center">
          <p className="font-display text-2xl font-bold text-cloud">No trips saved yet.</p>
          <p className="mt-2 text-mist">Plan one and it'll land here.</p>
          <Link
            to="/discover"
            className="mt-6 inline-block rounded-full bg-runway px-7 py-3 font-mono text-sm font-bold uppercase tracking-widest text-night hover:bg-cloud"
          >
            Plan a trip
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {savedTrips.map((trip) => (
            <BoardingPass
              key={trip.id}
              trip={trip}
              variant="card"
              actions={
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <Link
                    to={`/playlist/${trip.id}`}
                    className="rounded-full bg-runway px-4 py-1.5 font-bold text-night hover:bg-cloud"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="text-mist hover:text-alert"
                    aria-label={`Remove ${trip.destination} trip`}
                  >
                    Remove
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
