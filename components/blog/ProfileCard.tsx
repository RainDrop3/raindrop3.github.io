import ThemeToggle from "@/components/blog/ThemeToggle";

const GITHUB_URL = "https://github.com/RainDrop3";
const EMAIL_ADDRESS = "kanghy6220@gmail.com";

export default function ProfileCard() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Profile</p>
        <ThemeToggle />
      </div>
      <h2 className="mt-3 text-xl font-bold">Kang</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">가장 중요한 것은 기본기</p>
      <p className="mt-3 text-sm text-zinc-500">CA · OS · NW · DB · PL</p>

      <div className="mt-5 flex items-center gap-2 border-t border-zinc-200 pt-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.49.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.95-2.34 4.82-4.58 5.08.36.31.68.92.68 1.86 0 1.34-.01 2.43-.01 2.76 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2z" />
          </svg>
        </a>

        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          aria-label="Email"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}