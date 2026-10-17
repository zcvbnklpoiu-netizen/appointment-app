import Link from "next/link";

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><Link href="/" className="font-bold text-teal-950">MediaBook</Link><p className="mt-1 max-w-lg text-xs leading-5 text-slate-600">A platform for exploring listed care options and managing appointment requests. It does not provide medical advice.</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm"><Link href="/explore" className="text-slate-600 hover:text-teal-900">Find a doctor</Link><Link href="/about" className="text-slate-600 hover:text-teal-900">About</Link><Link href="/contact" className="text-slate-600 hover:text-teal-900">Contact</Link></nav></div></footer>;
}
