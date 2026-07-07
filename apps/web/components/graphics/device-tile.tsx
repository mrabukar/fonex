import Image from "next/image";
import { colorFamilies, type ColorFamily, type DeviceType } from "@/lib/content";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getDeviceStyle(type: DeviceType, f: ColorFamily, scale: number): React.CSSProperties {
  const sc = `linear-gradient(160deg,${f.g1},${f.g2})`;
  const sh = "0 18px 30px -12px rgba(11,18,38,.4)";
  const s = (n: number) => Math.round(n * scale);
  switch (type) {
    case "phone":
      return { width: s(92), height: s(150), borderRadius: s(20), background: sc, border: "5px solid #0B1226", boxShadow: sh };
    case "watch":
      return { width: s(80), height: s(92), borderRadius: s(24), background: sc, border: "6px solid #0B1226", boxShadow: sh };
    case "charger":
      return { width: s(74), height: s(104), borderRadius: s(16), background: sc, boxShadow: sh };
    case "earbuds":
      return { width: s(112), height: s(60), borderRadius: s(30), background: sc, boxShadow: sh };
    case "case":
      return {
        width: s(92),
        height: s(150),
        borderRadius: s(22),
        background: "transparent",
        border: `7px solid ${f.g1}`,
        boxShadow: "0 16px 28px -12px rgba(11,18,38,.22)",
      };
    case "screen":
      return { width: s(92), height: s(150), borderRadius: s(14), background: sc, border: "2px solid rgba(255,255,255,.7)", boxShadow: sh };
    default:
      return { width: s(70), height: s(118), borderRadius: s(12), background: sc, boxShadow: sh };
  }
}

interface DeviceTileProps {
  fam: string;
  type: DeviceType;
  img?: string;
  size?: "sm" | "lg";
}

export function DeviceTile({ fam, type, img, size = "sm" }: DeviceTileProps) {
  const f = colorFamilies[fam] ?? colorFamilies.blue;
  const isLg = size === "lg";
  const sizes = isLg
    ? "(max-width: 1024px) 100vw, 50vw"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  if (img) {
    const tint = `linear-gradient(160deg, ${hexToRgba(f.g1, 0.34)}, ${hexToRgba(f.g2, 0.06)} 55%, transparent)`;
    return (
      <div
        style={{
          position: "relative",
          height: isLg ? 440 : 210,
          overflow: "hidden",
          background: `linear-gradient(135deg,${f.bgA},${f.bgB})`,
        }}
      >
        <Image src={img} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: tint }} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: isLg ? 420 : 190,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg,${f.bgA},${f.bgB})`,
      }}
    >
      <div style={getDeviceStyle(type, f, isLg ? 1.9 : 1)} />
    </div>
  );
}
