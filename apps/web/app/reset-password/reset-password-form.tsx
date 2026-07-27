"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const searchError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired. Request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(resetError.message ?? "This reset link is invalid or has expired. Request a new one.");
        return;
      }

      setDone(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch {
      setError("Could not reach the server. Check that the API is running and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
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
          Reset password
        </h2>
        <p className="mt-1.5 text-[14.5px]" style={{ color: "#5A6480" }}>
          Choose a new password for your admin account.
        </p>

        {done ? (
          <div
            className="mt-8 rounded-lg px-3.5 py-3 text-[13.5px] font-medium"
            style={{ background: "#EEF6EE", color: "#1E6B3A" }}
            role="status"
          >
            Password updated. Redirecting you to sign in…
          </div>
        ) : !token || searchError ? (
          <div className="mt-8 flex flex-col gap-4">
            <div
              className="rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium"
              style={{ background: "#FDECEC", color: "#B3261E" }}
              role="alert"
            >
              This reset link is invalid or has expired.
            </div>
            <Link href="/forgot-password" className="font-semibold hover:underline text-[13.5px]" style={{ color: "#1A1C74" }}>
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  autoComplete="new-password"
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-9 pr-10"
                />
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
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-[13px]" style={{ color: "#9098AE" }}>
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#1A1C74" }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
