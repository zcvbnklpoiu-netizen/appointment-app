"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isRegister = mode === "register";

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      const result = isRegister
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message ?? "We could not complete your request.");
      } else {
        setSuccess(isRegister ? "Your patient account was created." : "You are signed in.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("The account service is unavailable. Please try again shortly.");
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="mt-7 space-y-5">
    {isRegister && <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label><input id="name" required maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA]" /></div>}
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><input id="email" type="email" required autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA]" /></div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><input id="password" type="password" required minLength={12} maxLength={128} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA]" />{isRegister && <p className="mt-1 text-xs text-slate-500">Use at least 12 characters.</p>}</div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{success}</p>}
    <button disabled={pending} className="w-full rounded-xl bg-[#263F3A] px-5 py-3 font-semibold text-white hover:bg-[#1D302D] disabled:opacity-60">{pending ? "Please wait…" : isRegister ? "Create patient account" : "Sign in"}</button>
    <p className="text-center text-sm text-slate-600">{isRegister ? "Already have an account?" : "New to MediaBook?"} <Link className="font-semibold text-[#344B72] hover:underline" href={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
  </form>;
}
