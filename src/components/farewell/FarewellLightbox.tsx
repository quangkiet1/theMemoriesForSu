"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { FarewellMemory } from "@/types/farewell";

interface FarewellLightboxProps {
  memories: FarewellMemory[];
  selectedId: string | null;
  onClose: () => void;
}

export default function FarewellLightbox({
  memories,
  selectedId,
  onClose,
}: FarewellLightboxProps) {
  const reducedMotion = useReducedMotion();

  // Track navigation state as (lastSelectedId, index) pair so we can
  // detect when parent selects a new photo vs user navigating prev/next
  const [navState, setNavState] = useState<{ lastSelectedId: string | null; index: number }>(
    () => {
      const idx = memories.findIndex((m) => m.id === selectedId);
      return { lastSelectedId: selectedId, index: Math.max(idx, 0) };
    }
  );

  // Derived: if selectedId changed from outside, reset to that photo's index
  const derivedIndex =
    selectedId !== null && selectedId !== navState.lastSelectedId
      ? memories.findIndex((m) => m.id === selectedId)
      : navState.index;

  // Update lastSelectedId in state when selectedId changes (during render is fine
  // because we are just syncing derived state, not triggering effects)
  if (selectedId !== null && selectedId !== navState.lastSelectedId) {
    setNavState({ lastSelectedId: selectedId, index: Math.max(derivedIndex, 0) });
  }

  const currentIndex = selectedId !== null ? Math.max(derivedIndex, 0) : navState.index;
  const current = memories[currentIndex] ?? null;

  const goNext = useCallback(() => {
    setNavState((prev) => ({
      ...prev,
      index: (prev.index + 1) % memories.length,
    }));
  }, [memories.length]);

  const goPrev = useCallback(() => {
    setNavState((prev) => ({
      ...prev,
      index: (prev.index - 1 + memories.length) % memories.length,
    }));
  }, [memories.length]);

  // Keyboard handling
  useEffect(() => {
    if (selectedId === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, onClose, goNext, goPrev]);

  // Lock scroll when open
  useEffect(() => {
    if (selectedId !== null) {
      document.documentElement.classList.add("lock-scroll");
    } else {
      document.documentElement.classList.remove("lock-scroll");
    }
    return () => document.documentElement.classList.remove("lock-scroll");
  }, [selectedId]);

  // Touch swipe
  const touchStartXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <AnimatePresence>
      {selectedId !== null && current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
          className="lightbox-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh: ${current.alt}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Content — stop propagation to prevent close on click */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.28 }}
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div
              style={{
                width: "min(85vw, 800px)",
                maxHeight: "75dvh",
                position: "relative",
                aspectRatio: "4/3",
              }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                style={{ objectPosition: current.objectPosition || "center" }}
                sizes="min(85vw, 800px)"
                priority
              />
            </div>

            {/* Caption */}
            {(current.caption || current.date) && (
              <div
                style={{
                  background: "rgba(8,6,4,0.8)",
                  padding: "0.75rem 1.25rem",
                  borderTop: "1px solid rgba(185,154,103,0.15)",
                }}
              >
                {current.caption && (
                  <p
                    className="font-serif"
                    style={{
                      color: "var(--cream-paper)",
                      fontSize: "0.9rem",
                      fontStyle: "italic",
                      opacity: 0.85,
                    }}
                  >
                    {current.caption}
                  </p>
                )}
                {current.date && (
                  <p
                    className="font-sans"
                    style={{
                      color: "var(--paper-gray)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      opacity: 0.6,
                    }}
                  >
                    {current.date}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation — prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              background: "rgba(8,6,4,0.6)",
              border: "1px solid rgba(185,154,103,0.2)",
              color: "var(--cream-paper)",
              fontSize: "1.25rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            aria-label="Ảnh trước"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(120,43,53,0.7)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(8,6,4,0.6)")
            }
          >
            ←
          </button>

          {/* Navigation — next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              background: "rgba(8,6,4,0.6)",
              border: "1px solid rgba(185,154,103,0.2)",
              color: "var(--cream-paper)",
              fontSize: "1.25rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            aria-label="Ảnh sau"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(120,43,53,0.7)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(8,6,4,0.6)")
            }
          >
            →
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              background: "rgba(8,6,4,0.6)",
              border: "1px solid rgba(185,154,103,0.2)",
              borderRadius: "50%",
              color: "var(--cream-paper)",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
            aria-label="Đóng ảnh (Escape)"
          >
            ✕
          </button>

          {/* Counter */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
            style={{
              padding: "0.3rem 0.75rem",
              background: "rgba(8,6,4,0.55)",
              borderRadius: "999px",
              color: "var(--paper-gray)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            {currentIndex + 1} / {memories.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
