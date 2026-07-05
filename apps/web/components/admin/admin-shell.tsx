import { cn } from "@/lib/utils";

export const adminShellClass =
  "mx-auto w-full max-w-[min(100%,90rem)] px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

export function AdminShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(adminShellClass, className)}>{children}</div>;
}

export function AdminShellRoot({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell min-h-screen">{children}</div>;
}
