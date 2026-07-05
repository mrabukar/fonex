"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/lib/content";
import { Container } from "@/components/container";

function FonexLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Fonex Supply Limited"
    >
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 object-contain"
        priority
      />
      <span
        className="font-extrabold text-[21px] uppercase leading-none"
        style={{
          fontFamily: "var(--font-sora)",
          letterSpacing: "-0.03em",
        }}
        aria-hidden
      >
        <span style={{ color: "#0B1226" }}>Fon</span>
        <span style={{ color: "#F5A623" }}>ex</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #E7EAF3",
      }}
    >
      <Container className="h-[72px] flex items-center justify-between gap-6">
        <FonexLogo />

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2.5 rounded-[10px] font-semibold text-[14.5px] transition-colors"
                style={{
                  color: active ? "#1A1C74" : "#4C566F",
                  background: active ? "#EEF1FB" : "transparent",
                  fontFamily: "var(--font-manrope)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/products"
          className="hidden md:inline-flex items-center gap-2 font-bold text-[14.5px] text-white px-[18px] py-[11px] rounded-[11px] transition-colors hover:bg-[#12144F]"
          style={{
            background: "#1A1C74",
            boxShadow: "0 8px 20px rgba(26,28,116,.28)",
            fontFamily: "var(--font-manrope)",
          }}
        >
          Browse Products
          <span aria-hidden>→</span>
        </Link>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger
            className="md:hidden p-2 rounded-lg"
            aria-label="Open menu"
            style={{ color: "#0B1226" }}
          >
            <Menu size={22} />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 p-6"
            style={{ background: "#fff" }}
          >
            <div className="mb-8">
              <FonexLogo />
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 rounded-[10px] font-semibold text-[15px] transition-colors"
                    style={{
                      color: active ? "#1A1C74" : "#4C566F",
                      background: active ? "#EEF1FB" : "transparent",
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/products"
                className="mt-4 text-center font-bold text-[15px] text-white px-4 py-3 rounded-[11px]"
                style={{
                  background: "#1A1C74",
                  fontFamily: "var(--font-manrope)",
                }}
              >
                Browse Products
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
