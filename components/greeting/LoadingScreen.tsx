"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  recipientName: string;
  themeEmoji: string;
  bgClass: string;
  bgStyle?: React.CSSProperties;
  onComplete: () => void;
}

export default function LoadingScreen({
  recipientName,
  themeEmoji,
  bgClass,
  bgStyle,
  onComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Animate from 0 → 100 over ~2.5s with easing
    const steps = 60;
    const duration = 2500;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      // Ease-out curve
      const eased = Math.round((1 - Math.pow(1 - current / steps, 3)) * 100);
      setProgress(eased);
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-8 ${bgClass}`}
          style={bgStyle}
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 20 + Math.random() * 60,
                  height: 20 + Math.random() * 60,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs">
            {/* Pulsing emoji */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl md:text-7xl"
            >
              {themeEmoji}
            </motion.div>

            {/* Text */}
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm mb-1"
              >
                Preparing something special for
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white font-bold text-2xl"
              >
                {recipientName} 💌
              </motion.p>
            </div>

            {/* Progress bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/50 text-xs">Loading your greeting...</p>
                <p className="text-white font-bold text-sm">{progress}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
