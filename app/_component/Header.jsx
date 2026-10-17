
import Image from "next/image";
import Link from "next/link";
import { publicImage } from "@/lib/public-image";

function Header() {
  const Menu = [
    { name: "Home", path: "/" },
    { name: "Find a doctor", path: "/explore" },
    { name: "Specialties", path: "/specialties" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-5">
        <Image
          src={publicImage("/logo.png")}
          alt="MediaBook"
          width={42}
          height={42}
        />

        <nav aria-label="Main navigation">
        <ul className="hidden gap-1 md:flex">
          {Menu.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-900"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        </nav>
      </div>
      <details className="relative order-3 w-full md:hidden">
        <summary className="inline-flex cursor-pointer list-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-teal-800">Menu</summary>
        <nav aria-label="Mobile navigation" className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {Menu.map((item) => <Link key={item.name} href={item.path} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900">{item.name}</Link>)}
        </nav>
      </details>
      <div className="flex items-center gap-2">
        <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign in</Link>
        <Link href="/register" className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900">Create account</Link>
      </div>
    </header>
  );
}

export default Header;
