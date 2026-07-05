import Image from "next/image";

export function PhoneGraphic() {
  return (
    <div className="relative h-[540px]">
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 70% 35%, rgba(26,28,116,.22), transparent 70%), radial-gradient(50% 50% at 30% 75%, rgba(245,166,35,.20), transparent 70%), radial-gradient(45% 45% at 80% 85%, rgba(245,166,35,.20), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      {/* Signal arcs */}
      <div
        className="absolute animate-pulse-arc"
        style={{
          top: 40,
          right: 36,
          width: 240,
          height: 340,
          border: "1.5px solid rgba(26,28,116,.18)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute animate-pulse-arc-2"
        style={{
          top: 90,
          right: 86,
          width: 140,
          height: 240,
          border: "1.5px solid rgba(245,166,35,.18)",
          borderRadius: "50%",
        }}
      />
      {/* Phone device */}
      <div
        className="absolute animate-float"
        style={{
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 236,
          height: 478,
          background: "#0B1226",
          borderRadius: 38,
          padding: 11,
          boxShadow: "0 40px 80px -24px rgba(11,18,38,.55)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            background: "linear-gradient(160deg,#1B2546,#0E1630)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 96,
              height: 22,
              background: "#0B1226",
              borderRadius: 999,
            }}
          />
          {/* Screen content */}
          <div style={{ padding: "46px 18px 18px" }}>
            <div style={{ color: "#7E88A6", fontSize: 11, fontWeight: 600 }}>Good morning</div>
            <div
              style={{
                color: "#fff",
                fontFamily: "var(--font-sora)",
                fontWeight: 700,
                fontSize: 19,
                marginTop: 2,
              }}
            >
              Fonex Devices
            </div>
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 74,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#1A1C74,#3A3EAE)",
                }}
              />
              <div
                style={{
                  height: 74,
                  borderRadius: 14,
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.1)",
                }}
              />
              <div
                style={{
                  height: 74,
                  borderRadius: 14,
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.1)",
                }}
              />
              <div
                style={{
                  height: 74,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#F5A623,#13A6c0)",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 14,
                height: 46,
                borderRadius: 13,
                background: "rgba(255,255,255,.06)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "#F5A623",
                  display: "block",
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,.14)",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating chip — top left */}
      <div
        className="absolute animate-float-2"
        style={{
          top: 116,
          left: 0,
          display: "flex",
          alignItems: "center",
          gap: 11,
          background: "#fff",
          border: "1px solid #EDEFF6",
          borderRadius: 16,
          padding: "10px 14px 10px 10px",
          boxShadow: "0 16px 34px rgba(11,18,38,.14)",
        }}
      >
        <span
          style={{
            position: "relative",
            width: 46,
            height: 46,
            borderRadius: 11,
            overflow: "hidden",
            flexShrink: 0,
            display: "block",
            background: "linear-gradient(135deg,#1A1C74,#F5A623)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&q=80"
            alt="Flagship smartphone"
            fill
            style={{ objectFit: "cover" }}
          />
        </span>
        <div>
          <div style={{ fontSize: 11, color: "#7B8499", fontWeight: 600 }}>In stock</div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16, color: "#0B1226" }}>
            Flagship 5G
          </div>
        </div>
      </div>

      {/* Floating chip — bottom right */}
      <div
        className="absolute animate-float"
        style={{
          bottom: 60,
          right: 0,
          background: "#fff",
          border: "1px solid #EDEFF6",
          borderRadius: 14,
          padding: "12px 15px",
          boxShadow: "0 16px 34px rgba(11,18,38,.12)",
          animationDelay: "0.4s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#1BC47D",
              display: "block",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1226" }}>
            Genuine guaranteed
          </span>
        </div>
      </div>
    </div>
  );
}
