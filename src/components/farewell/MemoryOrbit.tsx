"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import MemoryCard from "./MemoryCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";
import type { FarewellMemory } from "@/types/farewell";

interface MemoryOrbitProps {
  memories: FarewellMemory[];
  centerMessage: string;
  isVisible: boolean;
  onSelectMemory: (id: string) => void;
}

interface OrbitSize {
  radiusX: number;
  radiusY: number;
  cardSize: number;
  centerX: number;
  centerY: number;
}

interface CardPosition {
  memory: FarewellMemory;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

function getOrbitSize(): OrbitSize {
  if (typeof window === "undefined") {
    return { radiusX: 320, radiusY: 110, cardSize: 120, centerX: 400, centerY: 300 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 768;
  return {
    radiusX: Math.min(vw * 0.38, 340),
    radiusY: Math.min(vh * 0.16, 120),
    cardSize: isMobile ? 90 : 120,
    centerX: vw / 2,
    centerY: vh / 2,
  };
}

function computeCardPositions(
  memories: FarewellMemory[],
  angleOffset: number,
  size: OrbitSize
): CardPosition[] {
  const sorted = [...memories].sort(
    (a, b) => (a.orbitOrder ?? 99) - (b.orbitOrder ?? 99)
  );
  const angleStep = (2 * Math.PI) / Math.max(sorted.length, 1);

  return sorted.map((memory, index) => {
    const angle = angleOffset + index * angleStep;
    const x = Math.cos(angle) * size.radiusX;
    const y = Math.sin(angle) * size.radiusY;
    // normalise y to [0,1] (front = 1)
    const frontness = (y + size.radiusY) / (2 * size.radiusY);
    const scale = 0.7 + frontness * 0.45;
    const opacity = 0.55 + frontness * 0.45;
    const zIndex = Math.round(frontness * 50) + 1;

    return {
      memory,
      x: size.centerX + x,
      y: size.centerY + y,
      scale,
      opacity,
      zIndex,
    };
  });
}

export default function MemoryOrbit({
  memories,
  centerMessage,
  isVisible,
  onSelectMemory,
}: MemoryOrbitProps) {
  const reducedMotion = useReducedMotion();

  // Orbit size stored in state, initialized lazily on client
  const [orbitSize, setOrbitSize] = useState<OrbitSize>(() =>
    getOrbitSize()
  );

  // Card positions stored in state, updated each animation frame
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);

  // Mutable refs — not used during render
  const angleOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragAngleStartRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orbitSizeRef = useRef<OrbitSize>(orbitSize);

  // Keep orbitSizeRef in sync without triggering re-renders
  useEffect(() => {
    orbitSizeRef.current = orbitSize;
  }, [orbitSize]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const next = getOrbitSize();
      setOrbitSize(next);
      orbitSizeRef.current = next;
      // Compute positions with new size immediately
      const positions = computeCardPositions(
        memories,
        angleOffsetRef.current,
        next
      );
      setCardPositions(positions);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize/update positions when memories change
  useEffect(() => {
    const positions = computeCardPositions(
      memories,
      angleOffsetRef.current,
      orbitSizeRef.current
    );
    setCardPositions(positions);
  }, [memories]);

  // Animation loop
  const startAnimation = useCallback(() => {
    if (reducedMotion) return;

    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPausedRef.current && !isDraggingRef.current) {
        angleOffsetRef.current += (delta / 1000) * 0.25; // 0.25 rad/s
        setCardPositions(
          computeCardPositions(memories, angleOffsetRef.current, orbitSizeRef.current)
        );
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [reducedMotion, memories]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      stopAnimation();
      return;
    }
    startAnimation();
    return stopAnimation;
  }, [isVisible, startAnimation, stopAnimation]);

  // Pause when tab hidden
  useVisibilityPause(
    () => { isPausedRef.current = false; },
    () => { isPausedRef.current = true; }
  );

  // Drag/touch handling
  const handleDragStart = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    dragAngleStartRef.current = angleOffsetRef.current;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - dragStartXRef.current;
    angleOffsetRef.current = dragAngleStartRef.current + delta * 0.003;
    setCardPositions(
      computeCardPositions(memories, angleOffsetRef.current, orbitSizeRef.current)
    );
  }, [memories]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    idleTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2000);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientX);
    isPausedRef.current = true;
  }, [handleDragStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const onMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
    isPausedRef.current = true;
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Clean up idle timer
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Sorted memories for reduced-motion fallback
  const sortedMemories = [...memories].sort(
    (a, b) => (a.orbitOrder ?? 99) - (b.orbitOrder ?? 99)
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="memory-orbit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.8 }}
          className="orbit-backdrop fixed inset-0 overflow-hidden"
          style={{ cursor: "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-label="Vòng ký ức — kéo trái hoặc phải để xem các ảnh"
        >
          {/* Subtle radial glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: orbitSize.centerX,
              top: orbitSize.centerY,
              transform: "translate(-50%, -50%)",
              width: Math.min(orbitSize.radiusX * 0.7, 220),
              height: Math.min(orbitSize.radiusX * 0.7, 220),
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(185,154,103,0.08) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Center message */}
          <div
            className="absolute pointer-events-none z-30"
            style={{
              left: orbitSize.centerX,
              top: orbitSize.centerY,
              transform: "translate(-50%, -50%)",
              width: Math.min(orbitSize.radiusX * 0.55, 200),
              textAlign: "center",
            }}
          >
            <p
              className="orbit-center-text"
              style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)" }}
            >
              {centerMessage}
            </p>
          </div>

          {/* Orbit track */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <ellipse
              cx={orbitSize.centerX}
              cy={orbitSize.centerY}
              rx={orbitSize.radiusX}
              ry={orbitSize.radiusY}
              fill="none"
              stroke="rgba(185,154,103,0.12)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>

          {/* Memory cards — render back-to-front */}
          {!reducedMotion &&
            [...cardPositions]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(({ memory, x, y, scale, opacity, zIndex }) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  x={x}
                  y={y}
                  scale={scale}
                  opacity={opacity}
                  zIndex={zIndex}
                  size={orbitSize.cardSize}
                  onClick={onSelectMemory}
                />
              ))}

          {/* Reduced-motion: static grid */}
          {reducedMotion && (
            <div
              className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-8"
              style={{ zIndex: 10 }}
            >
              {sortedMemories.map((memory) => (
                <button
                  key={memory.id}
                  className="memory-card relative"
                  style={{ width: 120, height: 150, flexShrink: 0 }}
                  onClick={() => onSelectMemory(memory.id)}
                  aria-label={`Xem ảnh: ${memory.alt}`}
                  id={`memory-card-${memory.id}`}
                >
                  <Image
                    src={memory.src}
                    alt={memory.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: memory.objectPosition || "center" }}
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
