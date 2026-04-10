export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 md:px-12 py-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-white/20">
          © 2026 Hatchling Creative, LLC
        </p>
        <div className="flex gap-6 font-sans text-xs text-white/20">
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            GitHub
          </a>
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="hover:text-white/50 transition-colors"
            data-cursor=""
          >
            Twitter
          </a>
        </div>
        <p className="font-sans text-xs text-white/20">Portland, OR</p>
      </div>
    </footer>
  );
}
