interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, center, light }: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <div
          className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
          style={{ color: light ? "#8B97C4" : "#1A1C74" }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className="font-bold text-balance"
        style={{
          fontFamily: "var(--font-sora)",
          fontWeight: 800,
          color: light ? "#fff" : "#0B1226",
          letterSpacing: "-.025em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 leading-relaxed"
          style={{ color: light ? "#A9B2CC" : "#4C566F" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
