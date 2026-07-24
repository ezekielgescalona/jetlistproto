import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
      isActive ? 'text-runway' : 'text-mist hover:text-cloud'
    }`;

  const handleLogOut = () => {
    logOut();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-bold tracking-tight text-cloud">
            JETLIST<span className="text-runway">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-mist sm:inline">
            destination radio
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-radar">✦ {user.name}</span>
              <button
                onClick={handleLogOut}
                className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-mist hover:border-runway hover:text-runway"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-runway px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-night hover:bg-cloud"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-cloud md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          <span className="font-mono text-sm">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-white/5 px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={handleLogOut}
                className="w-fit rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-mist"
              >
                Log out ({user.name})
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="w-fit rounded-full bg-runway px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-night"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
