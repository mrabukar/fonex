"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
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
          Forgot password
        </h2>
        <p className="mt-1.5 text-[14.5px]" style={{ color: "#5A6480" }}>
          Enter your admin email and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <div
            className="mt-8 rounded-lg px-3.5 py-3 text-[13.5px] font-medium"
            style={{ background: "#EEF6EE", color: "#1E6B3A" }}
            role="status"
          >
            If that email is registered, check your inbox for a reset link. It expires in 1 hour.
          </div>
        ) : (
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
              {loading ? "Sending…" : "Send reset link"}
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
