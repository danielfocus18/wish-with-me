"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function InteractiveHero({
  title,
  recipientName,
  themeEmoji,
  theme,
  colors,
  ctaYesLabel,
  ctaNoLabel,
  noButtonBehavior,
  noButtonLabels,
  onYes,
}: InteractiveHeroProps) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [noScale, setNoScale] = useState(1);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const labels = noButtonLabels?.length ? noButtonLabels : DEFAULT_NO_LABELS;
  const currentNoLabel = labels[Math.min(noClickCount, labels.length - 1)];
  const isExhausted = noClickCount >= labels.length - 1;

  const useCustom = colors?.useCustomColors === true;
  const textClass = useCustom ? "" : theme.text;
  const textStyle = useCustom ? { color: colors!.textColor } : {};

  const handleNo = () => {
    const next = noClickCount + 1;
    setNoClickCount(next);

    if (noButtonBehavior === "shrink") {
      setNoScale(s => Math.max(s - 0.15, 0.25));
    }

    if (noButtonBehavior === "runaway" && containerRef.current) {
      const box = containerRef.current.getBoundingClientRect();
      const maxX = box.width - 140;
      const maxY = box.height - 60;
      setNoPos({
        x: Math.random() * maxX - maxX / 2,
        y: Math.random() * maxY - maxY / 2,
      });
    }

    if (noButtonBehavior === "countdown" && next >= labels.length) {
      // After countdown completes, reveal the card anyway
      setTimeout(onYes, 600);
    }
  };

  const handleYes = () => {
    setShowScrollHint(false);
    onYes();
  };

  const bgClass = useCustom ? "" : theme.bg;
  const bgStyle = useCustom
    ? { background: `linear-gradient(135deg, ${colors!.bgFrom}, ${colors!.bgVia}, ${colors!.bgTo})` }
    : {};

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden ${bgClass}`}
      style={bgStyle}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${8 + i * 9}%`, top: "110%" }}
            animate={{ y: "-120vh", opacity: [0, 0.7, 0.7, 0] }}
            transition={{
              duration: 5 + i * 0.6,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {themeEmoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl w-full">
        {/* Pulsing emoji */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl md:text-8xl"
        >
          {themeEmoji}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className={`text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg ${textClass}`}
          style={textStyle}
        >
          {title}
        </motion.h1>

        {/* Recipient */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className={`text-lg md:text-xl ${textClass}`}
          style={textStyle}
        >
          For <span className="font-bold">{recipientName}</span> 💌
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", damping: 18 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm relative"
        >
          {/* YES button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleYes}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white text-gray-900 font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <Heart size={18} className="fill-red-500 text-red-500" />
            {ctaYesLabel}
          </motion.button>

          {/* NO button — behavior-driven */}
          <AnimatePresence mode="wait">
            {!isExhausted || noButtonBehavior !== "countdown" ? (
              <motion.button
                key={currentNoLabel}
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: isExhausted ? 0.3 : 1,
                  scale: noScale,
                  x: noPos?.x ?? 0,
                  y: noPos?.y ?? 0,
                }}
                whileHover={noButtonBehavior === "runaway" ? {} : { scale: noScale * 1.04 }}
                whileTap={{ scale: noScale * 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={handleNo}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white/20 backdrop-blur-sm text-white font-bold text-base rounded-2xl border border-white/30 transition-colors"
                style={textStyle}
              >
                <motion.span
                  key={currentNoLabel}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentNoLabel}
                </motion.span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Click count feedback */}
        <AnimatePresence>
          {noClickCount > 0 && (
            <motion.p
              key={noClickCount}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.6, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm italic ${textClass}`}
              style={textStyle}
            >
              {noClickCount === 1 && "Are you sure? 🥺"}
              {noClickCount === 2 && "Really...? 😔"}
              {noClickCount === 3 && "Take your time..."}
              {noClickCount >= 4 && noClickCount < labels.length - 1 && "Still here waiting 💌"}
              {noClickCount >= labels.length - 1 && "Ok... 💔"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${textClass}`}
            style={textStyle}
          >
            <span className="text-xs opacity-60">Scroll for more</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <ChevronDown size={18} className="opacity-60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
