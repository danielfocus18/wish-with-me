"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeRevealProps {
  bgStyle: React.CSSProperties;
  bgClass: string;
  themeEmoji: string;
  recipientName: string;
  onComplete: () => void;
}

export default function EnvelopeReveal({ bgStyle, bgClass, themeEmoji, recipientName, onComplete }: EnvelopeRevealProps) {
  const [stage, setStage] = useState<"idle" | "shaking" | "opening" | "done">("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("shaking"), 600);
    const t2 = setTimeout(() => setStage("opening"), 2000);
    const t3 = setTimeout(() => { setStage("done"); setTimeout(onComplete, 700); }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgClass}`}
          style={bgStyle}
        >
          {/* Background shimmer particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i}
                className="absolute rounded-full bg-white/10"
                style={{ width: 10 + (i % 4) * 20, height: 10 + (i % 4) * 20, left: `${5 + i * 7}%`, top: `${10 + (i % 5) * 18}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2 + (i % 3), delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* To: label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage === "shaking" || stage === "opening" ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm md:text-base font-medium tracking-widest uppercase"
            >
              For {recipientName} 💌
            </motion.div>

            {/* Envelope SVG */}
            <motion.div
              animate={
                stage === "shaking"
                  ? { rotate: [0, -4, 4, -3, 3, -2, 2, 0], y: [0, -4, 4, -2, 2, 0] }
                  : stage === "opening"
                  ? { scale: [1, 1.08, 1.05], y: [0, -8, -4] }
                  : {}
              }
              transition={{
                duration: stage === "shaking" ? 0.8 : 0.6,
                repeat: stage === "shaking" ? 2 : 0,
                ease: "easeInOut",
              }}
            >
              <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Envelope body */}
                <rect x="10" y="40" width="180" height="110" rx="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>

                {/* Envelope flap — animates open */}
                <motion.path
                  d={stage === "opening" ? "M10 40 L100 20 L190 40 L100 40 Z" : "M10 40 L100 100 L190 40 Z"}
                  fill="rgba(255,255,255,0.22)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* V fold lines on body */}
                <line x1="10" y1="40" x2="100" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1="190" y1="40" x2="100" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>

                {/* Wax seal */}
                <motion.g
                  animate={stage === "opening" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "100px 100px" }}
                >
                  <circle cx="100" cy="100" r="18" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <text x="100" y="106" textAnchor="middle" fontSize="16" fill="white">♥</text>
                </motion.g>
              </svg>
            </motion.div>

            {/* Card sliding out */}
            <AnimatePresence>
              {stage === "opening" && (
                <motion.div
                  initial={{ y: 0, opacity: 0, scale: 0.8 }}
                  animate={{ y: -80, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="absolute"
                  style={{ top: "30%" }}
                >
                  <div className="bg-white/90 rounded-2xl px-8 py-5 shadow-2xl flex flex-col items-center gap-2">
                    <span className="text-4xl">{themeEmoji}</span>
                    <span className="text-gray-800 font-bold text-sm">Opening your card...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap hint */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: stage === "idle" ? 0 : 0.5 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-xs tracking-widest uppercase mt-2"
            >
              {stage === "shaking" ? "Something's inside..." : stage === "opening" ? "Opening..." : ""}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
