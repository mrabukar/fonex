import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  sub?: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, sub, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted">
        <Icon size={22} className="text-muted-foreground" />
      </span>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
