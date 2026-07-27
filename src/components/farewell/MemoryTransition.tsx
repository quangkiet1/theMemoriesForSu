"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MemoryTransitionProps {
  isTransitioning: boolean;
}

/**
 * Overlay that fades in during the transition from letter to memories.
 * Creates a smooth colour shift between the two stages.
 */
export default function MemoryTransition({
  isTransitioning,
}: MemoryTransitionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.5 }}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, #1a1510 0%, #080604 100%)",
      }}
      aria-hidden="true"
    />
  );
}
