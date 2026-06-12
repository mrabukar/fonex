import Link from "next/link";

interface CtaBandProps {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaBand({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-14 flex items-center justify-between gap-8 flex-wrap"
      style={{ background: "linear-gradient(120deg,#2F5BFF,#6C5CE7)" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute"
        style={{
          top: -40,
          right: -20,
          width: 300,
          height: 300,
          border: "1.5px solid rgba(255,255,255,.16)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          top: 20,
          right: 60,
          width: 200,
          height: 200,
          border: "1.5px solid rgba(255,255,255,.12)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-[560px]">
        <h2
          className="font-extrabold text-white text-balance mb-3"
          style={{
            fontFamily: "var(--font-sora)",
            fontSize: 36,
            lineHeight: 1.12,
            letterSpacing: "-.025em",
          }}
        >
          {title}
        </h2>
        <p className="text-[16.5px] leading-relaxed" style={{ color: "rgba(255,255,255,.85)" }}>
          {subtitle}
        </p>
      </div>

      <div className="relative flex gap-3.5 flex-wrap">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center font-bold text-[16px] px-6 py-4 rounded-[13px] transition-colors"
          style={{
            background: "#fff",
            color: "#2147E6",
            boxShadow: "0 12px 28px rgba(0,0,0,.18)",
            fontFamily: "var(--font-manrope)",
          }}
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center font-bold text-[16px] px-6 py-4 rounded-[13px] transition-colors"
            style={{
              background: "rgba(255,255,255,.14)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.35)",
              fontFamily: "var(--font-manrope)",
            }}
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
