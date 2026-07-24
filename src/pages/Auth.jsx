import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Auth (/auth) — sign up, log in, log out live here.
 * Wired to the demo AuthContext today; only AuthContext.jsx changes
 * when Firebase Authentication replaces the mock next week.
 */
export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, signUp, logIn, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from ?? '/dashboard';

  const FIREBASE_ERROR_MESSAGES = {
    'auth/email-already-in-use': 'An account with that email already exists — try logging in.',
    'auth/invalid-email': 'That email address doesn’t look right.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found for that email — sign up first.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts — wait a moment and try again.',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your name.');
        await signUp({ name, email, password });
      } else {
        await logIn({ email, password });
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setError(FIREBASE_ERROR_MESSAGES[err.code] ?? err.message);
    }
  }

  // Already signed in → show a simple profile card instead of the form.
  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-cabin p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-radar">
            Signed in
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-cloud">
            Welcome back, {user.name}.
          </h1>
          <p className="mt-2 font-mono text-sm text-mist">{user.email}</p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-full bg-runway px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-night hover:bg-cloud"
            >
              My trips
            </button>
            <button
              onClick={logOut}
              className="rounded-full border border-white/15 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-mist hover:border-alert hover:text-alert"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-night px-4 py-3 text-cloud placeholder:text-mist/50 focus:border-runway focus:outline-none';

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-radar">
        Passenger check-in
      </p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-cloud">
        {mode === 'login' ? 'Log in' : 'Create account'}
      </h1>

      {/* Mode tabs */}
      <div className="mt-6 flex gap-2 rounded-full border border-white/10 bg-cabin p-1 font-mono text-xs uppercase tracking-widest">
        {['login', 'signup'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError('');
            }}
            className={`flex-1 rounded-full py-2 transition-colors ${
              mode === m ? 'bg-runway font-bold text-night' : 'text-mist hover:text-cloud'
            }`}
          >
            {m === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            autoComplete="name"
            className={inputClass}
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          className={inputClass}
        />

        <button
          type="submit"
          className="w-full rounded-full bg-runway py-3 font-mono text-sm font-bold uppercase tracking-widest text-night hover:bg-cloud"
        >
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </button>

        {error && (
          <p className="rounded-xl border border-alert/30 bg-alert/10 p-3.5 text-sm text-alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
