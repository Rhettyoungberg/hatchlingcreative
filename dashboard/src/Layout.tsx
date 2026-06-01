import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export default function Layout() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet text-void font-bold">
              H
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg">Hatchling</div>
              <div className="-mt-1 text-[11px] uppercase tracking-widest text-white/40">
                Mission Control
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {loc.pathname !== "/" && (
              <Link to="/" className="text-white/50 hover:text-white">
                ← All apps
              </Link>
            )}
            <span className="hidden text-white/40 sm:inline">{user?.email}</span>
            <button onClick={logout} className="btn-ghost">
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
