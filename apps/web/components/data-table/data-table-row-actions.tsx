"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface DataTableRowAction<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (row: TData) => void;
  variant?: "default" | "destructive";
  hidden?: (row: TData) => boolean;
  separatorBefore?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: TData;
  actions: DataTableRowAction<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const visible = actions.filter((action) => !action.hidden?.(row));

  if (!visible.length) return null;

  return (
    <div className="inline-flex items-center justify-center gap-1.5">
      {visible.map((action) => {
        const Icon = action.icon;
        const isDestructive = action.variant === "destructive";

        return (
          <Button
            key={action.label}
            type="button"
            variant={isDestructive ? "destructive" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
          >
            {Icon ? <Icon className="size-3.5" /> : null}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
