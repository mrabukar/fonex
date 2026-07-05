"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user.role === "admin") {
      router.replace("/admin/products");
    }
  }, [isPending, session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({ email, password });

      if (signInError) {
        setError(signInError.message ?? "Invalid email or password");
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Could not reach the server. Check that the API is running and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || session?.user.role === "admin") {
    return null;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div
        className="relative hidden overflow-hidden md:flex md:flex-col md:justify-between p-12"
        style={{ background: "linear-gradient(160deg,#0B1226,#1A1C74 65%,#12144F)" }}
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(245,166,35,.25), transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-16 h-[480px] w-[480px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(58,62,174,.4), transparent)" }}
        />
        <motion.div
          className="pointer-events-none absolute right-20 top-24 h-40 w-40 rounded-[28%] border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-32 left-24 h-24 w-24 rounded-full border border-[#F5A623]/25"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" priority />
          <span
            className="font-extrabold text-[21px] uppercase leading-none"
            style={{ fontFamily: "var(--font-sora)", letterSpacing: "-0.03em" }}
          >
            <span className="text-white">Fon</span>
            <span style={{ color: "#F5A623" }}>ex</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[.08em]"
            style={{ background: "rgba(245,166,35,.14)", color: "#F5A623" }}
          >
            <ShieldCheck size={14} />
            Admin Console
          </div>
          <h1
            className="font-extrabold text-white text-balance"
            style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(30px, 3vw, 40px)", lineHeight: 1.12, letterSpacing: "-.02em" }}
          >
            Manage your catalog, one sign-in away.
          </h1>
          <p className="mt-4 text-[15.5px] leading-[1.65]" style={{ color: "#A9B2CC" }}>
            Sign in to manage products, categories, and everything that keeps Fonex Supply running.
          </p>
        </div>

        <p className="relative z-10 text-[13px]" style={{ color: "#6F7A9B" }}>
          © {new Date().getFullYear()} Fonex Supply Limited. Restricted access.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5 md:hidden">
            <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" priority />
            <span className="font-extrabold text-[19px] uppercase leading-none" style={{ fontFamily: "var(--font-sora)" }}>
              <span style={{ color: "#0B1226" }}>Fon</span>
              <span style={{ color: "#F5A623" }}>ex</span>
            </span>
          </div>

          <h2
            className="font-extrabold text-[26px]"
            style={{ fontFamily: "var(--font-sora)", color: "#0B1226", letterSpacing: "-.02em" }}
          >
            Admin sign in
          </h2>
          <p className="mt-1.5 text-[14.5px]" style={{ color: "#5A6480" }}>
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@fonexsupply.com"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium"
                style={{ background: "#FDECEC", color: "#B3261E" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="h-11 text-[14.5px] font-bold">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[13px]" style={{ color: "#9098AE" }}>
            <Link href="/" className="font-semibold hover:underline" style={{ color: "#1A1C74" }}>
              ← Back to the main site
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
