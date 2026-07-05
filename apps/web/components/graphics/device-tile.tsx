import Image from "next/image";
import { colorFamilies, type ColorFamily, type DeviceType } from "@/lib/content";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getDeviceStyle(type: DeviceType, f: ColorFamily): React.CSSProperties {
  const sc = `linear-gradient(160deg,${f.g1},${f.g2})`;
  const sh = "0 18px 30px -12px rgba(11,18,38,.4)";
  switch (type) {
    case "phone":
      return { width: 92, height: 150, borderRadius: 20, background: sc, border: "5px solid #0B1226", boxShadow: sh };
    case "watch":
      return { width: 80, height: 92, borderRadius: 24, background: sc, border: "6px solid #0B1226", boxShadow: sh };
    case "charger":
      return { width: 74, height: 104, borderRadius: 16, background: sc, boxShadow: sh };
    case "earbuds":
      return { width: 112, height: 60, borderRadius: 30, background: sc, boxShadow: sh };
    case "case":
      return {
        width: 92,
        height: 150,
        borderRadius: 22,
        background: "transparent",
        border: `7px solid ${f.g1}`,
        boxShadow: "0 16px 28px -12px rgba(11,18,38,.22)",
      };
    case "screen":
      return { width: 92, height: 150, borderRadius: 14, background: sc, border: "2px solid rgba(255,255,255,.7)", boxShadow: sh };
    default:
      return { width: 70, height: 118, borderRadius: 12, background: sc, boxShadow: sh };
  }
}

interface DeviceTileProps {
  fam: string;
  type: DeviceType;
  img?: string;
}

export function DeviceTile({ fam, type, img }: DeviceTileProps) {
  const f = colorFamilies[fam] ?? colorFamilies.blue;

  if (img) {
    const tint = `linear-gradient(160deg, ${hexToRgba(f.g1, 0.34)}, ${hexToRgba(f.g2, 0.06)} 55%, transparent)`;
    return (
      <div
        style={{
          position: "relative",
          height: 210,
          overflow: "hidden",
          background: `linear-gradient(135deg,${f.bgA},${f.bgB})`,
        }}
      >
        <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: tint }} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: 190,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg,${f.bgA},${f.bgB})`,
      }}
    >
      <div style={getDeviceStyle(type, f)} />
    </div>
  );
}
