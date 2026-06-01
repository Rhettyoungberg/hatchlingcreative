import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";

const ERROR_TEXT: Record<string, string> = {
  invalid_or_expired: "That link was invalid or expired. Request a new one below.",
  not_allowed: "That email isn't on the allowlist.",
  missing_token: "Something went wrong with the link. Try again.",
};

export default function Login() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) nav("/", { replace: true });
  }, [loading, user, nav]);

  const urlError = params.get("error");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.login(email.trim());
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet text-void font-bold">
            H
          </div>
          <div>
            <div className="font-serif text-2xl">Hatchling</div>
            <div className="-mt-1 text-xs uppercase tracking-widest text-white/40">
              Mission Control
            </div>
          </div>
        </div>

        {urlError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {ERROR_TEXT[urlError] || "Login failed. Try again."}
          </div>
        )}

        {sent ? (
          <div className="space-y-3">
            <h1 className="text-lg font-medium">Check your inbox</h1>
            <p className="text-sm text-white/50">
              If <span className="text-white/80">{email}</span> is on the allowlist, a login link
              is on its way. It expires in 15 minutes.
            </p>
            <button className="btn-ghost mt-2" onClick={() => setSent(false)}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Email address</label>
              <input
                type="email"
                required
                autoFocus
                className="input"
                placeholder="you@hatchlingcreative.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send me a magic link"}
            </button>
            <p className="text-center text-xs text-white/30">
              Passwordless sign-in. We'll email you a one-time link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
