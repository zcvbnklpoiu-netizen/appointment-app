import AuthForm from "../_component/AuthForm";

export const metadata = { title: "Sign in | MediaBook" };

export default function LoginPage() {
  return <main className="mx-auto max-w-lg px-4 py-14 sm:px-6"><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"><p className="text-sm font-semibold text-[#344B72]">Welcome back</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Sign in to MediaBook</h1><p className="mt-3 text-sm leading-6 text-slate-600">Use your patient or clinic account credentials.</p><AuthForm mode="login" /></div></main>;
}
