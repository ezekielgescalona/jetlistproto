/**
 * TripsContext.jsx — where generated trips live.
 *
 * Two tiers:
 *   • sessionTrips — every playlist generated this session (in memory only).
 *   • savedTrips   — trips the signed-in user chose to keep, synced live
 *                    from Firestore's users/{uid}/trips collection so they
 *                    follow the account across devices, not just refreshes.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const TripsContext = createContext(null);

const tripsCollectionFor = (uid) => collection(db, 'users', uid, 'trips');

export function TripsProvider({ children }) {
  const { user } = useAuth();
  const [sessionTrips, setSessionTrips] = useState({}); // { [id]: trip }
  const [savedTrips, setSavedTrips] = useState([]);

  // Subscribe to this user's saved trips whenever the signed-in user changes.
  useEffect(() => {
    if (!user) {
      setSavedTrips([]);
      return;
    }
    const unsubscribe = onSnapshot(tripsCollectionFor(user.uid), (snapshot) => {
      setSavedTrips(snapshot.docs.map((d) => d.data()));
    });
    return unsubscribe;
  }, [user]);

  const addSessionTrip = (trip) =>
    setSessionTrips((prev) => ({ ...prev, [trip.id]: trip }));

  const getTrip = (id) =>
    sessionTrips[id] ?? savedTrips.find((t) => t.id === id) ?? null;

  const isSaved = (id) => savedTrips.some((t) => t.id === id);

  const saveTrip = (trip) => {
    if (!user) return;
    setDoc(doc(tripsCollectionFor(user.uid), trip.id), trip);
  };

  const removeTrip = (id) => {
    if (!user) return;
    deleteDoc(doc(tripsCollectionFor(user.uid), id));
  };

  return (
    <TripsContext.Provider
      value={{ savedTrips, addSessionTrip, getTrip, isSaved, saveTrip, removeTrip }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used inside <TripsProvider>');
  return ctx;
}
