"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { FarewellLetterData } from "@/types/farewell";

interface FinalGoodbyeProps {
  data: FarewellLetterData;
  isVisible: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export default function FinalGoodbye({
  data,
  isVisible,
  onClose,
  onRestart,
}: FinalGoodbyeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="final-goodbye"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.8 }}
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto"
          style={{
            background:
              "radial-gradient(ellipse at center, #1c1410 0%, #0a0806 100%)",
            padding: "2rem 1.5rem",
          }}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.35, duration: reducedMotion ? 0.01 : 0.7 }}
            style={{
              maxWidth: "560px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Decorative line */}
            <div
              style={{
                width: 40,
                height: 1,
                background: "var(--gold-light)",
                opacity: 0.4,
                margin: "0 auto 2rem",
              }}
              aria-hidden="true"
            />

            {/* Title */}
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                color: "var(--cream-paper)",
                fontStyle: "italic",
                fontWeight: 400,
                marginBottom: "2rem",
                lineHeight: 1.3,
              }}
            >
              {data.finalTitle}
            </h2>

            {/* Paragraphs */}
            <div style={{ marginBottom: "2.5rem" }}>
              {data.finalParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-sans"
                  style={{
                    color: "var(--cream-paper)",
                    opacity: 0.75,
                    fontSize: "clamp(0.975rem, 2.2vw, 1.05rem)",
                    lineHeight: 1.85,
                    marginBottom: index < data.finalParagraphs.length - 1 ? "1.25rem" : 0,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature */}
            <p
              className="font-script"
              style={{
                color: "var(--gold-light)",
                fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
                marginBottom: "3rem",
                opacity: 0.8,
              }}
            >
              {data.finalSignature}
            </p>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(185,154,103,0.25), transparent)",
                marginBottom: "2.5rem",
              }}
              aria-hidden="true"
            />

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                className="btn-primary"
                onClick={onClose}
                id="close-letter-btn"
                style={{ minWidth: "180px" }}
              >
                Khép lại bức thư
              </button>
              <button
                className="btn-ghost"
                onClick={onRestart}
                id="restart-letter-btn"
                style={{ minWidth: "180px" }}
              >
                Đọc lại từ đầu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
