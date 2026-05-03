"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircleHeart } from "lucide-react";

interface Wish { id: string; name: string; message: string; created_at: string; }

interface WishesWallProps {
  greetingId: string;
  title?: string;
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function WishesWall({ greetingId, title, textClass, textStyle, cardBgClass, cardBgStyle }: WishesWallProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/api/wishes?greeting_id=${greetingId}`)
      .then(r => r.json())
      .then(data => setWishes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [greetingId]);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ greeting_id: greetingId, name: name.trim(), message: message.trim() }),
      });
      const wish = await res.json();
      setWishes(prev => [wish, ...prev]);
      setName(""); setMessage(""); setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {}
    finally { setSending(false); }
  };

  return (
    <div className="w-full mb-6">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className={`text-xl md:text-2xl font-bold text-center mb-2 ${textClass}`} style={textStyle}>
          {title || "Leave a Wish 💌"}
        </h2>
        <p className={`text-sm text-center opacity-60 mb-5 ${textClass}`} style={textStyle}>
          Add your message — they'll see it here
        </p>
      </motion.div>

      {/* Input form */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.1 }}
        className={`rounded-2xl p-4 mb-4 space-y-3 ${cardBgClass}`} style={cardBgStyle}>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-white/10 border border-white/20 text-inherit placeholder:opacity-40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          style={textStyle}
          maxLength={40}
        />
        <textarea
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Your wish..."
          rows={2}
          className="w-full bg-white/10 border border-white/20 text-inherit placeholder:opacity-40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          style={textStyle}
          maxLength={200}
        />
        <motion.button whileTap={{ scale: 0.96 }} onClick={handleSubmit}
          disabled={sending || !name.trim() || !message.trim()}
          className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={textStyle}
        >
          {sent ? "✓ Wish sent!" : sending ? "Sending..." : <><Send size={14} /> Send Wish</>}
        </motion.button>
      </motion.div>

      {/* Wishes grid */}
      <AnimatePresence>
        {wishes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wishes.map((w, i) => (
              <motion.div key={w.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-4 ${cardBgClass}`} style={cardBgStyle}
              >
                <div className={`flex items-center gap-2 mb-2 ${textClass}`} style={textStyle}>
                  <MessageCircleHeart size={14} className="opacity-60" />
                  <span className="text-sm font-bold">{w.name}</span>
                </div>
                <p className={`text-sm opacity-80 leading-relaxed ${textClass}`} style={textStyle}>{w.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
