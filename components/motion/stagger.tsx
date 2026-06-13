"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.21, 0.47, 0.32, 0.98];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  staggerKey?: string | number;
}

export function StaggerContainer({ children, className, style, staggerKey }: ContainerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px 0px" });

  return (
    <motion.div
      ref={ref}
      key={staggerKey}
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

interface ItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

export function StaggerItem({ children, className, style, hover = false }: ItemProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={itemVariants}
      whileHover={hover ? { y: -5, transition: { duration: 0.2, ease: "easeOut" } } : undefined}
    >
      {children}
    </motion.div>
  );
}
