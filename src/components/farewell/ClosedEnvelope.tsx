"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ClosedEnvelopeProps {
  recipientName: string;
  envelopeLabel: string;
  openButtonLabel: string;
  onOpen: () => void;
  isVisible: boolean;
}

export default function ClosedEnvelope({
  recipientName,
  envelopeLabel,
  openButtonLabel,
  onOpen,
  isVisible,
}: ClosedEnvelopeProps) {
  const reducedMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{
            duration: reducedMotion ? 0.01 : 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col items-center justify-center min-h-dvh px-4 py-8"
          style={{ background: "var(--cream-ivory)" }}
        >
          {/* Subtle background texture */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 20%, rgba(185,154,103,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(120,43,53,0.04) 0%, transparent 60%)",
            }}
          />

          {/* Envelope container */}
          <motion.div
            className="relative cursor-pointer select-none envelope-wrapper"
            style={{
              width: "min(420px, 92vw)",
            }}
            whileHover={
              reducedMotion
                ? {}
                : {
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }
            }
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            onClick={onOpen}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Phong bì gửi ${recipientName} — nhấn để mở thư`}
          >
            {/* Envelope SVG */}
            <EnvelopeSVG recipientName={recipientName} reducedMotion={reducedMotion} />
          </motion.div>

          {/* Text below envelope */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.6 }}
            className="mt-8 text-center space-y-2"
          >
            <p
              className="font-serif"
              style={{
                color: "var(--text-brown)",
                fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                letterSpacing: "0.08em",
                opacity: 0.6,
              }}
            >
              {envelopeLabel}
            </p>
          </motion.div>

          {/* Open button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.7, duration: 0.5 }}
            onClick={onOpen}
            className="btn-primary mt-6"
            aria-label="Mở bức thư"
            id="open-letter-btn"
          >
            {openButtonLabel}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Envelope SVG Component
// ============================================================

function EnvelopeSVG({
  recipientName,
  reducedMotion,
}: {
  recipientName: string;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: "420/280" }}
      aria-hidden="true"
    >
      {/* Shadow */}
      <motion.div
        className="absolute rounded-sm"
        style={{
          inset: 0,
          background: "rgba(48,38,33,0.12)",
          borderRadius: "4px",
          filter: "blur(12px)",
          transform: "translateY(8px) scaleX(0.95)",
        }}
        whileHover={reducedMotion ? {} : { opacity: 0.7 }}
      />

      {/* Envelope body */}
      <svg
        viewBox="0 0 420 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative"
        style={{ filter: "drop-shadow(0 4px 20px rgba(48,38,33,0.15))" }}
      >
        {/* Body */}
        <rect
          x="2"
          y="2"
          width="416"
          height="276"
          rx="4"
          fill="url(#envelopeBodyGrad)"
          stroke="rgba(138,105,64,0.3)"
          strokeWidth="1"
        />

        {/* Bottom fold lines */}
        <line
          x1="2"
          y1="278"
          x2="210"
          y2="155"
          stroke="rgba(138,105,64,0.25)"
          strokeWidth="1"
        />
        <line
          x1="418"
          y1="278"
          x2="210"
          y2="155"
          stroke="rgba(138,105,64,0.25)"
          strokeWidth="1"
        />

        {/* Left flap */}
        <polygon
          points="2,2 2,278 210,155"
          fill="url(#leftFlapGrad)"
          opacity="0.6"
        />

        {/* Right flap */}
        <polygon
          points="418,2 418,278 210,155"
          fill="url(#rightFlapGrad)"
          opacity="0.6"
        />

        {/* Top flap (closed) */}
        <polygon
          points="2,2 418,2 210,130"
          fill="url(#topFlapGrad)"
          stroke="rgba(138,105,64,0.2)"
          strokeWidth="1"
        />

        {/* Seal circle */}
        <circle
          cx="210"
          cy="138"
          r="20"
          fill="url(#sealGrad)"
          filter="url(#sealShadow)"
        />

        {/* Seal monogram / ornament */}
        <text
          x="210"
          y="143"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="16"
          fill="rgba(252,248,239,0.9)"
          fontStyle="italic"
        >
          ✦
        </text>

        {/* Recipient label */}
        <text
          x="210"
          y="210"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="14"
          fill="rgba(48,38,33,0.5)"
          fontStyle="italic"
        >
          Gửi —
        </text>
        <text
          x="210"
          y="232"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="16"
          fontWeight="500"
          fill="rgba(48,38,33,0.7)"
        >
          {recipientName}
        </text>

        {/* Corner stamp detail */}
        <rect
          x="370"
          y="20"
          width="32"
          height="38"
          rx="1"
          fill="none"
          stroke="rgba(138,105,64,0.3)"
          strokeWidth="1"
        />
        <rect
          x="373"
          y="23"
          width="26"
          height="32"
          rx="1"
          fill="rgba(185,154,103,0.12)"
          stroke="rgba(138,105,64,0.2)"
          strokeWidth="0.5"
        />

        {/* Definitions */}
        <defs>
          <linearGradient
            id="envelopeBodyGrad"
            x1="0"
            y1="0"
            x2="420"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#c8a882" />
            <stop offset="0.6" stopColor="#b8915e" />
            <stop offset="1" stopColor="#9a7346" />
          </linearGradient>
          <linearGradient
            id="topFlapGrad"
            x1="210"
            y1="0"
            x2="210"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a8865e" />
            <stop offset="1" stopColor="#8a6940" />
          </linearGradient>
          <linearGradient
            id="leftFlapGrad"
            x1="2"
            y1="140"
            x2="210"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#b89060" stopOpacity="0.5" />
            <stop offset="1" stopColor="#c8a882" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="rightFlapGrad"
            x1="418"
            y1="140"
            x2="210"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#b89060" stopOpacity="0.5" />
            <stop offset="1" stopColor="#c8a882" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="sealGrad" cx="50%" cy="40%" r="50%">
            <stop stopColor="#9b3644" />
            <stop offset="1" stopColor="#4b1f25" />
          </radialGradient>
          <filter id="sealShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#4b1f25"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
