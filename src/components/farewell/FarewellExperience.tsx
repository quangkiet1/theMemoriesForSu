"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClosedEnvelope from "./ClosedEnvelope";
import LetterPaper from "./LetterPaper";
import MemoryTransition from "./MemoryTransition";
import MemoryOrbit from "./MemoryOrbit";
import FarewellLightbox from "./FarewellLightbox";
import FinalGoodbye from "./FinalGoodbye";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { FarewellStage } from "@/types/farewell";
import type { FarewellLetterData } from "@/types/farewell";
import type { FarewellMemory } from "@/types/farewell";

interface FarewellExperienceProps {
  letterData: FarewellLetterData;
  memories: FarewellMemory[];
}

// ============================================================
// Opening Animation — envelope → letter
// ============================================================
function OpeningAnimation({
  isActive,
  onComplete,
  reducedMotion,
}: {
  isActive: boolean;
  onComplete: () => void;
  reducedMotion: boolean;
}) {
  useEffect(() => {
    if (!isActive) return;

    // Total animation time: ~1.5s normal, instant for reduced motion
    const timer = setTimeout(onComplete, reducedMotion ? 50 : 1500);
    return () => clearTimeout(timer);
  }, [isActive, onComplete, reducedMotion]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="opening-anim"
          className="fixed inset-0 z-20 flex items-center justify-center"
          style={{ background: "var(--cream-ivory)", pointerEvents: "none" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.5 }}
        >
          {/* Envelope opening */}
          <div
            style={{
              width: "min(420px, 92vw)",
              position: "relative",
            }}
          >
            {/* Body */}
            <motion.div
              initial={{ y: 0 }}
              animate={{
                y: reducedMotion ? 0 : [0, -8, 30],
                scale: reducedMotion ? 1 : [1, 1, 0.92],
                opacity: reducedMotion ? 0 : [1, 1, 0],
              }}
              transition={{
                duration: reducedMotion ? 0.01 : 1.2,
                times: [0, 0.3, 1],
                ease: "easeInOut",
              }}
              style={{ aspectRatio: "420/280", position: "relative" }}
            >
              <svg
                viewBox="0 0 420 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect
                  x="2"
                  y="2"
                  width="416"
                  height="276"
                  rx="4"
                  fill="url(#openBodyGrad)"
                  stroke="rgba(138,105,64,0.3)"
                  strokeWidth="1"
                />
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
                <polygon
                  points="2,2 2,278 210,155"
                  fill="url(#openLeftGrad)"
                  opacity="0.6"
                />
                <polygon
                  points="418,2 418,278 210,155"
                  fill="url(#openRightGrad)"
                  opacity="0.6"
                />

                {/* Open flap */}
                <motion.polygon
                  points="2,2 418,2 210,130"
                  fill="url(#openTopGrad)"
                  stroke="rgba(138,105,64,0.2)"
                  strokeWidth="1"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: reducedMotion ? 0 : -160 }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.2,
                    duration: reducedMotion ? 0.01 : 0.55,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "top" }}
                />

                {/* Letter paper emerging */}
                <motion.rect
                  x="80"
                  y="50"
                  width="260"
                  height="180"
                  rx="2"
                  fill="var(--cream-ivory)"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{
                    y: reducedMotion ? 50 : [50, 50, -20],
                    opacity: reducedMotion ? 0 : [0, 0.9, 1],
                  }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.4,
                    duration: reducedMotion ? 0.01 : 0.7,
                    times: [0, 0.2, 1],
                    ease: "easeOut",
                  }}
                />

                <defs>
                  <linearGradient
                    id="openBodyGrad"
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
                    id="openTopGrad"
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
                    id="openLeftGrad"
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
                    id="openRightGrad"
                    x1="418"
                    y1="140"
                    x2="210"
                    y2="140"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#b89060" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#c8a882" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Main FarewellExperience
// ============================================================

export default function FarewellExperience({
  letterData,
  memories,
}: FarewellExperienceProps) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<FarewellStage>("closed");
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const prevStageRef = useRef<FarewellStage>("closed");

  // Track stage transitions
  useEffect(() => {
    prevStageRef.current = stage;
  }, [stage]);

  // Preload memory images silently in background so they are cached instantly when orbit opens
  useEffect(() => {
    if (typeof window === "undefined") return;
    memories.forEach((mem) => {
      const img = new window.Image();
      img.src = mem.src;
    });
  }, [memories]);

  // ---- Stage transitions ----

  const handleOpenEnvelope = useCallback(() => {
    if (stage !== "closed") return;
    setStage("opening");
  }, [stage]);

  const handleOpeningComplete = useCallback(() => {
    setStage("reading");
    // Scroll to top when letter opens
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleOpenMemories = useCallback(() => {
    if (stage !== "reading") return;
    setStage("transitioning");

    // After transition overlay fades in, switch to memories stage
    const timer = setTimeout(
      () => setStage("memories"),
      reducedMotion ? 50 : 900
    );
    return () => clearTimeout(timer);
  }, [stage, reducedMotion]);

  const handleSelectMemory = useCallback((id: string) => {
    setSelectedMemoryId(id);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    const focusId = selectedMemoryId;
    setSelectedMemoryId(null);
    // Return focus to the card
    if (focusId) {
      setTimeout(() => {
        const el = document.getElementById(`memory-card-${focusId}`);
        el?.focus();
      }, 100);
    }
  }, [selectedMemoryId]);

  const handleShowEnding = useCallback(() => {
    setStage("ending");
  }, []);

  const handleClose = useCallback(() => {
    setStage("closed-again");
  }, []);

  const handleRestart = useCallback(() => {
    setStage("closed");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ---- Derived state ----
  const showEnvelope = stage === "closed" || stage === "closed-again";
  const showOpening = stage === "opening";
  const showLetter = stage === "reading";
  const showTransition = stage === "transitioning";
  const showOrbit = stage === "memories" || stage === "ending";
  const showEnding = stage === "ending";
  const showClosedAgain = stage === "closed-again";

  return (
    <div className="relative" style={{ minHeight: "100dvh" }}>
      {/* === Stage 1: Closed envelope === */}
      <ClosedEnvelope
        recipientName={letterData.recipientName}
        envelopeLabel={letterData.envelopeLabel}
        openButtonLabel={letterData.openButtonLabel}
        onOpen={handleOpenEnvelope}
        isVisible={showEnvelope && !showClosedAgain}
      />

      {/* === Stage: Closing animation === */}
      <AnimatePresence>
        {showClosedAgain && (
          <motion.div
            key="closed-again"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{
              background: "var(--cream-ivory)",
              padding: "2rem",
            }}
          >
            <div className="text-center space-y-4">
              <p
                className="font-serif"
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                  fontStyle: "italic",
                  color: "var(--wine-dark)",
                  opacity: 0.7,
                }}
              >
                Bức thư đã được khép lại.
              </p>
              <p
                className="font-sans"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-brown)",
                  opacity: 0.45,
                  letterSpacing: "0.05em",
                }}
              >
                Cảm ơn bạn đã đọc.
              </p>
              <div style={{ paddingTop: "1.5rem" }}>
                <button
                  className="btn-ghost"
                  onClick={handleRestart}
                  style={{
                    color: "var(--text-brown)",
                    borderColor: "rgba(48,38,33,0.2)",
                  }}
                >
                  Đọc lại từ đầu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Stage 2: Opening animation === */}
      <OpeningAnimation
        isActive={showOpening}
        onComplete={handleOpeningComplete}
        reducedMotion={reducedMotion}
      />

      {/* === Stage 3: Reading letter === */}
      <LetterPaper
        data={letterData}
        isVisible={showLetter}
        onOpenMemories={handleOpenMemories}
      />

      {/* === Transition overlay === */}
      <MemoryTransition isTransitioning={showTransition} />

      {/* === Stage 5: Memory orbit === */}
      <MemoryOrbit
        memories={memories}
        centerMessage={letterData.orbitCenterMessage}
        isVisible={showOrbit && !showEnding}
        onSelectMemory={handleSelectMemory}
      />

      {/* Orbit "view ending" button */}
      <AnimatePresence>
        {showOrbit && !showEnding && (
          <motion.div
            key="orbit-ending-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: reducedMotion ? 0 : 2, duration: reducedMotion ? 0.01 : 0.6 }}
            className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none"
          >
            <button
              className="btn-ghost pointer-events-auto"
              onClick={handleShowEnding}
              id="show-ending-btn"
              style={{
                background: "rgba(8,6,4,0.55)",
                backdropFilter: "blur(4px)",
              }}
            >
              Xem lời kết
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Stage 6: Final goodbye === */}
      <FinalGoodbye
        data={letterData}
        isVisible={showEnding}
        onClose={handleClose}
        onRestart={handleRestart}
      />

      {/* === Lightbox === */}
      <FarewellLightbox
        memories={memories}
        selectedId={selectedMemoryId}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
