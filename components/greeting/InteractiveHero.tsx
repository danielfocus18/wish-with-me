"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { ThemeConfig, ColorCustomization } from "@/types";

interface InteractiveHeroProps {
  title: string;
  recipientName: string;
  themeEmoji: string;
  theme: ThemeConfig;
  colors: ColorCustomization | null;
  ctaYesLabel: string;
  ctaNoLabel: string;
  noButtonBehavior: "cycle" | "runaway" | "shrink" | "countdown";
  noButtonLabels: string[];
  onYes: () => void;
}

const DEFAULT_NO_LABELS = [
  "Maybe Later",
  "Are you sure? 🥺",
  "Really though...",
  "Think about it...",
  "Last chance! 💔",
  "Ok fine... 😢",
];

const NO_CLICK_FEEDBACK = [
  "Are you sure? 🥺",
  "Really...? 😔",
  "Take your time...",
  "Still waiting 💌",
  "I'll be here...",
  "Ok... 💔",
];

export default function InteractiveHero({
  title, recipientName, themeEmoji, theme, colors,
  ctaYesLabel, ctaNoLabel, noButtonBehavior, noButtonLabels, onYes,
}: InteractiveHeroProps) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [noScale, setNoScale] = useState(1);
  const [noVisible, setNoVisible] = useState(true);
  const [countdownDone, setCountdownDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLDivElement>(null);

  // Runaway: spring-animated position
  const noX = useMotionValue(0);
  const noY = useMotionValue(0);
  const springX = useSpring(noX, { stiffness: 200, damping: 18 });
  const springY = useSpring(noY, { stiffness: 200, damping: 18 });

  const labels = noButtonLabels?.length ? noButtonLabels : DEFAULT_NO_LABELS;
  const currentNoLabel = noButtonBehavior === "countdown"
    ? noClickCount === 0
      ? `${ctaNoLabel}`
      : noClickCount < labels.length
        ? `${labels.length - noClickCount} more click${labels.length - noClickCount !== 1 ? "s" : ""}... 🥺`
        : "Fine... you win 😔"
    : labels[Math.min(noClickCount, labels.length - 1)];

  const useCustom = colors?.useCustomColors === true;
  const textClass = useCustom ? "" : theme.text;
  const textStyle = useCustom ? { color: colors!.textColor } : {};
  const bgClass = useCustom ? "" : theme.bg;
  const bgStyle: React.CSSProperties = useCustom
    ? { background: `linear-gradient(135deg, ${colors!.bgFrom}, ${colors!.bgVia}, ${colors!.bgTo})` }
    : {};

  // Runaway: jump to random position on hover
  const handleNoHover = useCallback(() => {
    if (noButtonBehavior !== "runaway" || !containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const maxX = (box.width / 2) - 80;
    const maxY = (box.height / 2) - 40;
    noX.set((Math.random() - 0.5) * maxX * 2);
    noY.set((Math.random() - 0.5) * maxY * 2);
  }, [noButtonBehavior, noX, noY]);

  const handleNo = () => {
    const next = noClickCount + 1;
    setNoClickCount(next);

    if (noButtonBehavior === "shrink") {
      const newScale = Math.max(noScale - 0.18, 0.15);
      setNoScale(newScale);
      if (newScale <= 0.15) {
        setTimeout(() => setNoVisible(false), 300);
      }
    }

    if (noButtonBehavior === "runaway") {
      handleNoHover();
    }

    if (noButtonBehavior === "countdown" && next >= labels.length) {
      setCountdownDone(true);
      setTimeout(onYes, 800);
    }
  };

  // Particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i, x: 4 + i * 8, delay: i * 0.35, dur: 5 + (i % 3) * 1.2, size: 14 + (i % 4) * 6,
  }));

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden ${bgClass}`}
      style={bgStyle}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id} className="absolute"
            style={{ left: `${p.x}%`, top: "110%", fontSize: p.size }}
            animate={{ y: "-120vh", opacity: [0, 0.65, 0.65, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          >
            {themeEmoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl w-full">
        {/* Pulsing emoji */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl md:text-8xl select-none"
        >
          {themeEmoji}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className={`text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg ${textClass}`}
          style={textStyle}
        >
          {title}
        </motion.h1>

        {/* Recipient */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
          transition={{ delay: 0.5 }}
          className={`text-lg md:text-xl ${textClass}`}
          style={textStyle}
        >
          For <span className="font-bold">{recipientName}</span> 💌
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, type: "spring", damping: 18 }}
          className="relative flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        >
          {/* YES */}
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
            onClick={onYes}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 bg-white text-gray-900 font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Heart size={18} className="fill-red-500 text-red-500" />
            {ctaYesLabel}
          </motion.button>

          {/* NO — behavior-driven */}
          <AnimatePresence>
            {noVisible && !countdownDone && (
              <motion.div
                ref={noBtnRef}
                style={noButtonBehavior === "runaway" ? { x: springX, y: springY } : {}}
                animate={{ scale: noScale, opacity: noScale < 0.3 ? noScale * 3 : 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex-1"
                onHoverStart={handleNoHover}
              >
                <motion.button
                  whileHover={noButtonBehavior !== "runaway" ? { scale: 1.04 } : {}}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleNo}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white/20 backdrop-blur-sm font-bold text-base rounded-2xl border border-white/30 transition-colors"
                  style={textStyle}
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={currentNoLabel}
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}
                      className={textClass} style={textStyle}
                    >
                      {currentNoLabel}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Per-click feedback text */}
        <AnimatePresence mode="wait">
          {noClickCount > 0 && !countdownDone && (
            <motion.p key={noClickCount}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.65, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              className={`text-sm italic ${textClass}`} style={textStyle}
            >
              {NO_CLICK_FEEDBACK[Math.min(noClickCount - 1, NO_CLICK_FEEDBACK.length - 1)]}
            </motion.p>
          )}
          {countdownDone && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`text-sm font-bold ${textClass}`} style={textStyle}
            >
              Revealing your card... 💌
            </motion.p>
          )}
          {!noVisible && noButtonBehavior === "shrink" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              className={`text-xs italic ${textClass}`} style={textStyle}
            >
              The "no" button disappeared 😄 Guess you have to say yes!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${textClass}`}
        style={textStyle}
      >
        <span className="text-xs opacity-50">Scroll for more</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ChevronDown size={18} className="opacity-50" />
        </motion.div>
      </motion.div>
    </div>
  );
}
