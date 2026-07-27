"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FarewellMemory } from "@/types/farewell";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MemoryCardProps {
  memory: FarewellMemory;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  size: number;
  onClick: (id: string) => void;
}

export default function MemoryCard({
  memory,
  x,
  y,
  scale,
  opacity,
  zIndex,
  size,
  onClick,
}: MemoryCardProps) {
  const reducedMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(memory.id);
    }
  };

  return (
    <motion.div
      className="memory-card absolute"
      style={{
        width: size,
        height: size * 1.25,
        x: x - size / 2,
        y: y - (size * 1.25) / 2,
        scale,
        opacity,
        zIndex,
      }}
      whileHover={reducedMotion ? {} : { scale: scale * 1.08 }}
      whileTap={reducedMotion ? {} : { scale: scale * 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onClick(memory.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Xem ảnh: ${memory.alt}`}
      id={`memory-card-${memory.id}`}
    >
      <Image
        src={memory.src}
        alt={memory.alt}
        fill
        className="object-cover"
        style={{
          objectPosition: memory.objectPosition || "center",
        }}
        sizes={`${size}px`}
        priority={memory.featured}
      />

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 50%, rgba(8,6,4,0.35) 100%)",
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
