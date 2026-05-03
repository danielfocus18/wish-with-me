"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BirthdayBannerProps {
  age?: number;
  name: string;
  textClass: string;
  textStyle?: React.CSSProperties;
}

export default function BirthdayBanner({ age, name, textClass, textStyle }: BirthdayBannerProps) {
  const [blown, setBlown] = useState<number[]>([]);
  const candles = age ? Math.min(age, 12) : 5;

  const blowCandle = (i: number) => {
    if (blown.includes(i)) return;
    setBlown(prev => [...prev, i]);
  };

  const allBlown = blown.length === candles;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full mb-6 text-center"
    >
      {/* Age display */}
      {age && (
        <div className="mb-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-7xl md:text-9xl font-black leading-none drop-shadow-2xl ${textClass}`}
            style={textStyle}
          >
            {age}
          </motion.div>
          <p className={`text-sm opacity-70 mt-1 ${textClass}`} style={textStyle}>
            {name} is turning {age} 🎂
          </p>
        </div>
      )}

      {/* Cake + candles */}
      <div className="flex items-end justify-center gap-1 mb-3">
        {Array.from({ length: candles }).map((_, i) => (
          <motion.button key={i} onClick={() => blowCandle(i)}
            whileTap={{ scale: 0.9 }}
            title="Tap to blow out!"
            className="flex flex-col items-center gap-0"
          >
            {/* Flame */}
            <AnimatePresence>
              {!blown.includes(i) ? (
                <motion.div key="flame"
                  animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], x: [0, 1, -1, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-base leading-none"
                >🔥</motion.div>
              ) : (
                <motion.div key="smoke" initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}
                  className="text-base leading-none">💨</motion.div>
              )}
            </AnimatePresence>
            {/* Candle */}
            <div className="w-3 h-6 rounded-t-sm bg-white/40 border border-white/30" />
          </motion.button>
        ))}
      </div>

      {/* Cake base emoji */}
      <div className="text-5xl mb-2">🎂</div>

      <p className={`text-xs opacity-60 ${textClass}`} style={textStyle}>
        {allBlown ? "🎉 All candles blown! Make a wish!" : "Tap the candles to blow them out!"}
      </p>
    </motion.div>
  );
}
