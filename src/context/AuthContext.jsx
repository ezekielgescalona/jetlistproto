/**
 * AuthContext.jsx — Firebase Authentication (email/password)
 *
 * Firebase's User object exposes `displayName`/`email`/`uid`, but the rest
 * of the app (Navbar, Dashboard, Auth) expects `{ name, email }`. We
 * normalize to that shape here so no other file has to know Firebase exists.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

const toUser = (firebaseUser) =>
  firebaseUser && {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email,
    email: firebaseUser.email,
  };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toUser(firebaseUser));
      setReady(true);
    });
    return unsubscribe;
  }, []);

  async function signUp({ name, email, password }) {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(firebaseUser, { displayName: name.trim() });
    setUser(toUser(firebaseUser));
  }

  async function logIn({ email, password }) {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    setUser(toUser(firebaseUser));
  }

  async function logOut() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, ready, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
