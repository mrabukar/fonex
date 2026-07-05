import { cn } from "@/lib/utils";

const countToneStyles = {
  amber: { background: "#FFF6E6", color: "#9A6400" },
  navy: { background: "#EEF1FB", color: "#1A1C74" },
} as const;

export function AdminPageHeader({
  title,
  count,
  countTone = "navy",
  description,
  action,
  footer,
}: {
  title: string;
  count?: number;
  countTone?: keyof typeof countToneStyles;
  description: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const showCount = count !== undefined;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E7EAF3]/80 bg-white/80 p-6 shadow-[0_6px_24px_-12px_rgba(11,18,38,.08)] backdrop-blur-sm",
        "sm:p-7",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className="font-extrabold text-[26px] tracking-tight lg:text-[28px]"
              style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
            >
              {title}
            </h1>
            {showCount && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[12.5px] font-bold"
                style={countToneStyles[countTone]}
              >
                {count}
              </span>
            )}
          </div>
          <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">{description}</p>
          {footer ? <div className="mt-3">{footer}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
