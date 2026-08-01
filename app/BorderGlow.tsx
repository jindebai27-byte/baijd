import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./BorderGlow.css";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

type GlowStyle = CSSProperties & Record<`--${string}`, string | number>;
const positions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function glowVars(color: string, intensity: number): GlowStyle {
  const match = color.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  const [h, s, l] = match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [119, 99, 46];
  const style = {} as GlowStyle;
  [100, 60, 50, 40, 30, 20, 10].forEach((opacity, index) => {
    const key = index === 0 ? "--glow-color" : `--glow-color-${opacity}`;
    style[key as `--${string}`] = `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return style;
}

function gradientVars(colors: string[]): GlowStyle {
  const style = {} as GlowStyle;
  positions.forEach((position, index) => {
    const color = colors[Math.min(colorMap[index], colors.length - 1)];
    style[`--gradient-${index + 1}`] = `radial-gradient(at ${position}, ${color} 0px, transparent 50%)`;
  });
  style["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return style;
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "119 99 46",
  backgroundColor = "rgba(24, 28, 29, .68)",
  borderRadius = 15,
  glowRadius = 24,
  glowIntensity = 1,
  coneSpread = 24,
  animated = false,
  colors = ["#04ea00", "#38bdf8", "#f4f7f4"],
  fillOpacity = .32,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    let frame = 0;
    const start = performance.now();
    card.classList.add("sweep-active");
    const sweep = (now: number) => {
      const progress = Math.min((now - start) / 1800, 1);
      const proximity = Math.sin(progress * Math.PI) * 82;
      card.style.setProperty("--edge-proximity", proximity.toFixed(2));
      card.style.setProperty("--cursor-angle", `${110 + progress * 355}deg`);
      if (progress < 1) frame = requestAnimationFrame(sweep);
      else card.classList.remove("sweep-active");
    };
    frame = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  const style: GlowStyle = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...glowVars(glowColor, glowIntensity),
    ...gradientVars(colors),
  };

  return <div ref={cardRef} onPointerMove={handlePointerMove} className={`border-glow-card ${className}`} style={style}><span className="edge-light" /><div className="border-glow-inner">{children}</div></div>;
}
