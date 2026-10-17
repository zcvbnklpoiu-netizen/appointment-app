import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-3 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
        Not found
      </span>
      <h1 className="text-4xl font-bold text-slate-900">This doctor profile is unavailable.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        The requested doctor profile does not exist or has been moved. Please review the available specialists and book a consultation.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700">
          Return home
        </Link>
        <Link href="/explore" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700">
          Explore clinic
        </Link>
      </div>
    </main>
  );
}
