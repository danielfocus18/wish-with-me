"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["❤️", "🥺", "😍", "🎉", "🥹", "💕"];

interface EmojiReactionsProps {
  greetingId: string;
  textClass: string;
  textStyle?: React.CSSProperties;
}

interface Counts { [emoji: string]: number; }

export default function EmojiReactions({ greetingId, textClass, textStyle }: EmojiReactionsProps) {
  const [counts, setCounts] = useState<Counts>({});
  const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
  const [bursting, setBursting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reactions?greeting_id=${greetingId}`)
      .then(r => r.json())
      .then(data => { if (data && typeof data === "object") setCounts(data); })
      .catch(() => {});
  }, [greetingId]);

  const handleReact = async (emoji: string) => {
    const alreadyReacted = myReactions.has(emoji);
    const delta = alreadyReacted ? -1 : 1;

    // Optimistic update
    setCounts(prev => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 0) + delta) }));
    setMyReactions(prev => {
      const next = new Set(prev);
      alreadyReacted ? next.delete(emoji) : next.add(emoji);
      return next;
    });

    if (!alreadyReacted) {
      setBursting(emoji);
      setTimeout(() => setBursting(null), 600);
    }

    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ greeting_id: greetingId, emoji, delta }),
    }).catch(() => {});
  };

  return (
    <div className="w-full mb-6">
      <p className={`text-xs text-center opacity-50 mb-3 ${textClass}`} style={textStyle}>
        React to this card
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {EMOJIS.map(emoji => {
          const count = counts[emoji] || 0;
          const active = myReactions.has(emoji);
          return (
            <motion.button key={emoji} whileTap={{ scale: 0.85 }}
              onClick={() => handleReact(emoji)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold border transition-all duration-200 ${
                active
                  ? "bg-white/30 border-white/50 scale-105"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
              style={textStyle}
            >
              <span className="text-base">{emoji}</span>
              {count > 0 && <span className={`text-xs ${textClass}`} style={textStyle}>{count}</span>}
              <AnimatePresence>
                {bursting === emoji && (
                  <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ scale: 1, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <span className="text-xl">{emoji}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
