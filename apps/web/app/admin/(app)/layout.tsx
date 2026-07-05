"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Package, ShieldAlert, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShell, AdminShellRoot } from "@/components/admin/admin-shell";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const isAdmin = session?.user.role === "admin";

  return (
    <AdminShellRoot>
      <header className="sticky top-0 z-30 border-b border-[#E7EAF3] bg-white/90 backdrop-blur-md">
        <AdminShell className="flex h-[4.25rem] items-center gap-6 lg:gap-8">
          <Link href="/admin/products" className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo.png" alt="" width={30} height={30} className="h-[30px] w-[30px] shrink-0 object-contain" priority />
            <span className="font-extrabold text-[16px] uppercase leading-none" style={{ fontFamily: "var(--font-sora)" }}>
              <span style={{ color: "#0B1226" }}>Fon</span>
              <span style={{ color: "#F5A623" }}>ex</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-[14px] font-semibold transition-colors",
                    active
                      ? "bg-[#EEF1FB] text-[#1A1C74] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#F5A623] after:content-['']"
                      : "text-[#5A6480] hover:bg-[#F4F6FB] hover:text-[#0B1226]",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            {session ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-semibold leading-tight text-foreground">{session.user.email}</p>
                  <p className="text-[11.5px] font-medium capitalize leading-tight text-muted-foreground">{session.user.role ?? "user"}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={async () => {
                    await signOut();
                    router.replace("/login");
                  }}
                >
                  <LogOut size={14} />
                  Sign out
                </Button>
              </>
            ) : (
              <Skeleton className="h-8 w-24 rounded-lg" />
            )}
          </div>
        </AdminShell>
      </header>

      <main className="py-8 lg:py-10">
        <AdminShell>
          {isPending || !session ? null : !isAdmin ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <ShieldAlert size={40} className="text-destructive" />
              <div>
                <p className="font-semibold text-foreground">You&apos;re signed in, but this account doesn&apos;t have admin access.</p>
                <p className="mt-1 text-sm text-muted-foreground">Signed in as {session.user.email}</p>
              </div>
            </div>
          ) : (
            children
          )}
        </AdminShell>
      </main>
    </AdminShellRoot>
  );
}
