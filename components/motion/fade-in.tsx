"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className,
  style,
}: FadeInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px 0px" });

  const offset = { x: 0, y: 0 };
  if (direction === "up") offset.y = 26;
  if (direction === "down") offset.y = -26;
  if (direction === "left") offset.x = 32;
  if (direction === "right") offset.x = -32;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
