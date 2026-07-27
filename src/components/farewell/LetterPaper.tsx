"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { FarewellLetterData } from "@/types/farewell";

interface LetterPaperProps {
  data: FarewellLetterData;
  isVisible: boolean;
  onOpenMemories: () => void;
}

export default function LetterPaper({
  data,
  isVisible,
  onOpenMemories,
}: LetterPaperProps) {
  const reducedMotion = useReducedMotion();
  const [memoryButtonVisible, setMemoryButtonVisible] = useState(false);
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);

  // Use IntersectionObserver to detect when near the end of the letter
  useEffect(() => {
    if (!isVisible || !sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMemoryButtonVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, [isVisible, sentinelEl]);

  // Fallback: if letter is short, show button after 1.2s
  const checkImmediate = useCallback(() => {
    if (!sentinelEl) return;
    const rect = sentinelEl.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setMemoryButtonVisible(true);
    }
  }, [sentinelEl]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(checkImmediate, 1200);
    return () => clearTimeout(timer);
  }, [isVisible, checkImmediate]);

  // Don't use an effect to reset — instead, the parent unmounts/remounts
  // LetterPaper with AnimatePresence which resets all state naturally.

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="letter-paper"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="letter-paper"
          style={{ minHeight: "100dvh", width: "100%" }}
        >
          {/* Paper texture */}
          <div
            className="pointer-events-none fixed inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(245,236,217,0.3) 0%, transparent 40%)",
              zIndex: 0,
            }}
            aria-hidden="true"
          />

          {/* Decorative top border */}
          <div
            className="sticky top-0 left-0 right-0 z-10"
            style={{
              height: "3px",
              background: "linear-gradient(90deg, transparent, var(--gold-light), transparent)",
              opacity: 0.5,
            }}
            aria-hidden="true"
          />

          {/* Letter content */}
          <LetterBody
            data={data}
            sentinelRef={setSentinelEl}
            memoryButtonVisible={memoryButtonVisible}
            onOpenMemories={onOpenMemories}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Letter Body — extracted to avoid circular dependency
// ============================================================

import type { RefCallback } from "react";

interface LetterBodyProps {
  data: FarewellLetterData;
  sentinelRef: RefCallback<HTMLDivElement>;
  memoryButtonVisible: boolean;
  onOpenMemories: () => void;
  reducedMotion: boolean;
}

function LetterBody({
  data,
  sentinelRef,
  memoryButtonVisible,
  onOpenMemories,
  reducedMotion,
}: LetterBodyProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.12,
        delayChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.01 : 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="letter-reading-area" id="letter-content">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="text-center space-y-3">
          <span className="letter-line" aria-hidden="true" />
          <p className="letter-eyebrow">{data.eyebrow}</p>
          {data.dateLabel && (
            <p className="letter-date" style={{ marginTop: "0.5rem" }}>
              {data.dateLabel}
            </p>
          )}
        </motion.header>

        {/* Recipient */}
        <motion.div variants={itemVariants}>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 0.9375rem)",
              color: "var(--gold-light)",
              fontStyle: "italic",
              marginBottom: "0.25rem",
            }}
          >
            Kính gửi,
          </p>
          <h1 className="letter-title" style={{ marginBottom: "0.5rem" }}>
            {data.recipientName}
          </h1>
          <div className="divider" />
        </motion.div>

        {/* Sub-title */}
        {data.title && (
          <motion.div variants={itemVariants}>
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                fontStyle: "italic",
                color: "var(--wine-dark)",
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {data.title}
            </h2>
          </motion.div>
        )}

        {/* Opening */}
        <motion.div variants={itemVariants}>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.0625rem)",
              fontStyle: "italic",
              color: "var(--wine-dark)",
              lineHeight: 1.8,
              opacity: 0.85,
            }}
          >
            {data.opening}
          </p>
        </motion.div>

        {/* Body paragraphs */}
        <motion.div variants={itemVariants} className="letter-body space-y-5">
          {data.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants}>
          <div className="divider" />
        </motion.div>

        {/* Closing */}
        <motion.div variants={itemVariants} className="space-y-4">
          <p className="letter-closing">{data.closing}</p>
        </motion.div>

        {/* Signature */}
        <motion.div variants={itemVariants} className="space-y-2 pt-4">
          {data.signature && (
            <p
              className="font-serif"
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                fontStyle: "italic",
                color: "var(--text-brown)",
                opacity: 0.8,
                lineHeight: 1.6,
              }}
            >
              {data.signature}
            </p>
          )}
          <p
            className="letter-signature"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
              marginTop: "0.25rem",
              color: "var(--wine-dark)",
            }}
          >
            {data.senderName}
          </p>
        </motion.div>

        {/* Memory trigger sentinel */}
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

        {/* Memory button — animated in/out */}
        <motion.div
          className="pt-8 pb-4 text-center space-y-4"
          animate={
            memoryButtonVisible
              ? { opacity: 1, y: 0, pointerEvents: "auto" }
              : { opacity: 0, y: 20, pointerEvents: "none" }
          }
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
          aria-hidden={!memoryButtonVisible}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
              fontStyle: "italic",
              color: "var(--text-brown)",
              opacity: 0.5,
            }}
          >
            {data.memoryIntro}
          </p>
          <button
            className="btn-memory"
            onClick={onOpenMemories}
            disabled={!memoryButtonVisible}
            tabIndex={memoryButtonVisible ? 0 : -1}
            id="open-memories-btn"
            aria-label="Xem lại những kỷ niệm"
          >
            {data.memoryButtonLabel}
          </button>
        </motion.div>

        {/* Bottom padding */}
        <div style={{ paddingBottom: "3rem" }} />
      </motion.div>
    </div>
  );
}
