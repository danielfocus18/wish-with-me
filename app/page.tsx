"use client";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { Gift, Sparkles, Star, Zap, Image, Music, Video, Heart, ChevronRight, ExternalLink, Award } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Animated Themes", desc: "8 stunning themes with live color customization" },
  { icon: Image, title: "Photo Slideshow", desc: "Multiple photos in an auto-playing gallery" },
  { icon: Music, title: "Background Music", desc: "Their song plays the moment they open it" },
  { icon: Video, title: "Video Messages", desc: "Upload personal videos or play behind the card" },
  { icon: Zap, title: "Interactive Mode", desc: "Yes/No buttons with run-away & countdown effects" },
  { icon: Heart, title: "Wishes Wall", desc: "Friends leave messages from the shared link" },
];

// ─── SCENE COMPONENTS ───────────────────────────────────────────

function SlideShow({ slides, accent }: { slides: string[]; accent: string }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(i => (i + 1) % slides.length), 900);
    return () => clearInterval(t);
  }, [slides.length]);
  return (
    <div className="w-full rounded-xl overflow-hidden relative" style={{ height: 90 }}>
      <AnimatePresence mode="wait">
        <motion.div key={cur}
          initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 rounded-xl flex items-center justify-center text-3xl"
          style={{ background: slides[cur] }}>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
        {slides.map((_, i) => (
          <div key={i} className={`rounded-full transition-all ${i === cur ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

function AnimatedPoemScene({ lines, textColor }: { lines: string[]; textColor: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= lines.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 500);
    return () => clearTimeout(t);
  }, [visible, lines.length]);
  return (
    <div className="space-y-1.5 py-1">
      {lines.map((line, i) => (
        <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: i < visible ? 1 : 0.1, y: i < visible ? 0 : 6 }}
          transition={{ duration: 0.4 }}
          className="text-xs italic text-center leading-relaxed"
          style={{ color: textColor, fontFamily: "'Playfair Display', serif" }}>
          {line}
        </motion.p>
      ))}
    </div>
  );
}

function DiplomaScene({ name, year, badges, textColor, borderColor }: { name: string; year: string; badges: string[]; textColor: string; borderColor: string }) {
  return (
    <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
      className="w-full rounded-xl p-3 border-2 text-center space-y-1.5"
      style={{ borderColor, background: "rgba(255,255,255,0.1)" }}>
      <p className="text-[10px] uppercase tracking-widest opacity-60" style={{ color: textColor }}>Certificate of Achievement</p>
      <p className="font-bold text-base" style={{ color: textColor, fontFamily: "'Merriweather', serif" }}>{name}</p>
      <p className="text-xs opacity-70" style={{ color: textColor }}>Class of {year} 🎓</p>
      <div className="flex flex-wrap gap-1 justify-center pt-1">
        {badges.map((b, i) => (
          <motion.span key={b} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1"
            style={{ color: textColor, borderColor }}>
            <Award size={8} />{b}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function CountdownScene({ label, textColor }: { label: string; textColor: string }) {
  const [secs, setSecs] = useState(47);
  const [mins, setMins] = useState(23);
  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => { if (s === 0) { setMins(m => m - 1); return 59; } return s - 1; });
    }, 80);
    return () => clearInterval(t);
  }, []);
  const units = [{ v: 3, l: "Days" }, { v: mins, l: "Hours" }, { v: secs, l: "Mins" }, { v: Math.floor(secs * 0.6), l: "Secs" }];
  return (
    <div className="w-full rounded-xl p-3 text-center space-y-2" style={{ background: "rgba(255,255,255,0.1)" }}>
      <p className="text-[10px] opacity-60" style={{ color: textColor }}>{label}</p>
      <div className="grid grid-cols-4 gap-1">
        {units.map(u => (
          <div key={u.l} className="flex flex-col items-center">
            <motion.span key={u.v} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-black tabular-nums" style={{ color: textColor }}>{String(u.v).padStart(2,"0")}</motion.span>
            <span className="text-[9px] opacity-40" style={{ color: textColor }}>{u.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandlesScene({ age, textColor }: { age: number; textColor: string }) {
  const [blown, setBlown] = useState<number[]>([]);
  const count = Math.min(age, 8);
  const blowNext = useCallback(() => {
    setBlown(b => b.length < count ? [...b, b.length] : []);
  }, [count]);
  useEffect(() => {
    const t = setInterval(blowNext, 600);
    return () => clearInterval(t);
  }, [blowNext]);
  return (
    <div className="text-center space-y-2">
      <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="text-5xl font-black leading-none drop-shadow-xl" style={{ color: textColor }}>
        {age}
      </motion.div>
      <div className="flex items-end justify-center gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!blown.includes(i)
                ? <motion.span key="flame" exit={{ scale: 0 }} className="text-sm leading-none">🔥</motion.span>
                : <motion.span key="out" initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="text-sm leading-none">💨</motion.span>
              }
            </AnimatePresence>
            <div className="w-2 h-4 rounded-t-sm" style={{ background: "rgba(255,255,255,0.5)" }} />
          </div>
        ))}
      </div>
      <div className="text-2xl">🎂</div>
    </div>
  );
}

function ReasonsScene({ reasons, textColor }: { reasons: string[]; textColor: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= reasons.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 450);
    return () => clearTimeout(t);
  }, [visible, reasons.length]);
  return (
    <div className="space-y-1.5">
      {reasons.map((r, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: i < visible ? 1 : 0.15, x: i < visible ? 0 : -16 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 rounded-xl px-3 py-1.5"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <span className="text-xs font-black opacity-60 w-4" style={{ color: textColor }}>{i + 1}</span>
          <span className="text-xs" style={{ color: textColor }}>{r}</span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} className="ml-auto text-xs">♥</motion.span>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineScene({ events, textColor }: { events: { date: string; title: string }[]; textColor: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => v < events.length ? v + 1 : v), 500);
    return () => clearInterval(t);
  }, [events.length]);
  return (
    <div className="relative pl-4 space-y-2">
      <div className="absolute left-1.5 top-0 bottom-0 w-0.5" style={{ background: "rgba(255,255,255,0.2)" }} />
      {events.map((e, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i < visible ? 1 : 0.1, x: i < visible ? 0 : -10 }}
          transition={{ duration: 0.35 }} className="flex gap-2 items-start">
          <div className="absolute left-0.5 mt-1 w-2 h-2 rounded-full border border-white/60" style={{ background: i < visible ? "white" : "transparent" }} />
          <div className="rounded-lg px-2 py-1 flex-1" style={{ background: "rgba(255,255,255,0.1)" }}>
            <p className="text-[9px] opacity-50" style={{ color: textColor }}>{e.date}</p>
            <p className="text-[11px] font-semibold" style={{ color: textColor }}>{e.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function WishesScene({ wishes, textColor }: { wishes: { name: string; msg: string }[]; textColor: string }) {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => v < wishes.length ? v + 1 : v), 600);
    return () => clearInterval(t);
  }, [wishes.length]);
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-center opacity-50 mb-1" style={{ color: textColor }}>💌 Wishes from friends</p>
      {wishes.slice(0, visible).map((w, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.12)" }}>
          <p className="text-[10px] font-bold mb-0.5" style={{ color: textColor }}>{w.name}</p>
          <p className="text-[10px] opacity-70" style={{ color: textColor }}>{w.msg}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InteractiveScene({ yesLabel, noLabel, textColor }: { yesLabel: string; noLabel: string; textColor: string }) {
  const [clicks, setClicks] = useState(0);
  const noLabels = [noLabel, "Are you sure? 🥺", "Really...?", "Last chance 💔", "Fine... 😢"];
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setNoPos({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 30 });
      setClicks(c => (c + 1) % noLabels.length);
    }, 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="space-y-3">
      <p className="text-xs text-center opacity-60" style={{ color: textColor }}>Tap to open the card ✨</p>
      <div className="flex gap-2 items-center justify-center relative" style={{ minHeight: 48 }}>
        <motion.button whileHover={{ scale: 1.05 }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-900 shadow-lg flex items-center gap-1">
          <Heart size={10} className="fill-red-500 text-red-500" />
          {yesLabel}
        </motion.button>
        <motion.button animate={{ x: noPos.x, y: noPos.y }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-white/30"
          style={{ background: "rgba(255,255,255,0.15)", color: textColor }}>
          <AnimatePresence mode="wait">
            <motion.span key={clicks} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}>
              {noLabels[clicks]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

function EmojiReactScene({ textColor }: { textColor: string }) {
  const emojis = ["❤️", "🥺", "😍", "🎉", "🥹", "💕"];
  const [counts, setCounts] = useState([12, 8, 15, 6, 9, 11]);
  useEffect(() => {
    const t = setInterval(() => {
      const i = Math.floor(Math.random() * emojis.length);
      setCounts(c => { const n = [...c]; n[i] += 1; return n; });
    }, 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-center opacity-50" style={{ color: textColor }}>Live reactions</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {emojis.map((e, i) => (
          <motion.div key={e} layout
            className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 text-xs"
            style={{ background: "rgba(255,255,255,0.12)", color: textColor }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <span>{e}</span>
            <motion.span key={counts[i]} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="font-bold text-[10px]">{counts[i]}</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SnowScene({ textColor }: { textColor: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 90, background: "rgba(255,255,255,0.06)" }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i}
          className="absolute text-white/70"
          style={{ left: `${i * 5}%`, fontSize: 8 + (i % 3) * 4, top: -10 }}
          animate={{ y: 110, opacity: [0, 0.8, 0] }}
          transition={{ duration: 2 + (i % 3) * 0.5, delay: i * 0.15, repeat: Infinity, ease: "linear" }}
        >❄</motion.div>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-3xl">🎄</span>
        <p className="text-xs font-bold" style={{ color: textColor }}>Merry Christmas!</p>
      </div>
    </div>
  );
}

function FireworksScene({ textColor }: { textColor: string }) {
  const colors = ["#facc15", "#a78bfa", "#f472b6", "#60a5fa", "#34d399"];
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 90, background: "rgba(0,0,0,0.2)" }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: colors[i % colors.length], left: "50%", top: "50%" }}
          animate={{
            x: [0, (Math.cos(i * 30 * Math.PI / 180) * 40)],
            y: [0, (Math.sin(i * 30 * Math.PI / 180) * 40)],
            opacity: [1, 0], scale: [1, 0]
          }}
          transition={{ duration: 0.8, delay: (i % 4) * 0.2, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-3xl">🎆</span>
        <p className="text-xs font-bold" style={{ color: textColor }}>Happy New Year!</p>
      </div>
    </div>
  );
}

// ─── TEMPLATE DEFINITIONS ───────────────────────────────────────

const TEMPLATES = [
  {
    id: "romantic", label: "Romantic Red", emoji: "❤️",
    bg: "linear-gradient(135deg, #e11d48, #ef4444, #f472b6)",
    font: "'Playfair Display', serif", ornament: "♥",
    title: "Will You Be Mine?", recipient: "My Love", sender: "Forever Yours",
    accent: "#fda4af", textColor: "#fff",
    scenes: ["interactive", "slideshow", "reasons", "poem"],
    slideColors: ["linear-gradient(135deg,#831843,#9f1239)", "linear-gradient(135deg,#be185d,#e11d48)", "linear-gradient(135deg,#f43f5e,#fb923c)"],
    reasons: ["The way you laugh", "Your warmth", "How you make me feel", "Every little thing"],
    poemLines: ["In your eyes I found my home,", "A love I never need to roam,", "With every breath I breathe your name,", "Nothing has ever felt the same."],
    interactiveLabels: { yes: "Yes, Forever! ❤️", no: "Maybe Later" },
    featureLabel: "Interactive · Slideshow · Music",
  },
  {
    id: "birthday", label: "Birthday Fun", emoji: "🎂",
    bg: "linear-gradient(135deg, #a855f7, #ec4899, #eab308)",
    font: "'Pacifico', cursive", ornament: "🎈",
    title: "Happy Birthday!", recipient: "Sarah", sender: "The Squad",
    accent: "#fde047", textColor: "#fff",
    scenes: ["candles", "slideshow", "wishes", "reasons"],
    slideColors: ["linear-gradient(135deg,#7c3aed,#a855f7)", "linear-gradient(135deg,#db2777,#ec4899)", "linear-gradient(135deg,#d97706,#fbbf24)"],
    age: 25,
    reasons: ["Your energy is contagious 🌟", "You make every day fun", "Your kindness to everyone", "The way you shine"],
    wishes: [{ name: "Mum", msg: "So proud of you baby! 🎂" }, { name: "Kofi", msg: "Cheers to 25! 🥂" }, { name: "Ama", msg: "Birthday twin vibes! 🎉" }],
    featureLabel: "Candles · Confetti · Wishes Wall",
  },
  {
    id: "graduation", label: "Graduation Gold", emoji: "🎓",
    bg: "linear-gradient(135deg, #a16207, #eab308, #fcd34d)",
    font: "'Merriweather', serif", ornament: "★",
    title: "You Did It! 🎓", recipient: "James", sender: "Mum & Dad",
    accent: "#fef08a", textColor: "#1c1917",
    scenes: ["diploma", "countdown", "timeline", "reasons"],
    badges: ["First Class", "Dean's List", "Best Project", "Top Graduate"],
    graduationYear: "2025",
    countdown: "Days Until Graduation",
    events: [{ date: "Sept 2021", title: "First day of university" }, { date: "Mar 2023", title: "Dean's List award" }, { date: "May 2025", title: "Graduation Day! 🎓" }],
    reasons: ["Your dedication inspires us", "Every late night paid off", "You never gave up", "We couldn't be prouder"],
    featureLabel: "Diploma · Badges · Timeline",
  },
  {
    id: "mothers", label: "Mother's Day", emoji: "🌷",
    bg: "linear-gradient(135deg, #f9a8d4, #fecdd3, #f0abfc)",
    font: "'Dancing Script', cursive", ornament: "❀",
    title: "For The Best Mum", recipient: "Mum", sender: "Your Baby",
    accent: "#fdf2f8", textColor: "#831843",
    scenes: ["poem", "reasons", "timeline", "wishes"],
    poemLines: ["You carried me before I knew the world,", "You held my hand as life unfurled,", "No words could ever say enough —", "Loving you has never been tough."],
    reasons: ["Your unconditional love", "The sacrifices you made", "Your warm hugs always help", "Simply being you"],
    events: [{ date: "2001", title: "You became my mum 🌷" }, { date: "2010", title: "School runs every day" }, { date: "2025", title: "Forever grateful" }],
    wishes: [{ name: "Daniel", msg: "Love you to the moon Mum! 🌷" }, { name: "Ama", msg: "Best mum ever! ❤️" }],
    featureLabel: "Poem · Reasons · Memory Timeline",
  },
  {
    id: "christmas", label: "Christmas Joy", emoji: "🎄",
    bg: "linear-gradient(135deg, #166534, #16a34a, #dc2626)",
    font: "'Mountains of Christmas', cursive", ornament: "✦",
    title: "Merry Christmas!", recipient: "The Family", sender: "Daniel & Family",
    accent: "#bbf7d0", textColor: "#fff",
    scenes: ["snow", "countdown", "wishes", "reasons"],
    countdown: "Days Until Christmas",
    wishes: [{ name: "Santa 🎅", msg: "Ho ho ho! You've been good!" }, { name: "Dad", msg: "Love you all so much 🎄" }, { name: "Sis", msg: "Best Christmas yet! ✨" }],
    reasons: ["Family time is everything", "Your warmth fills the room", "The magic you create", "Every memory together"],
    featureLabel: "Snow · Countdown · Wishes Wall",
  },
  {
    id: "newyear", label: "New Year Glow", emoji: "🎆",
    bg: "linear-gradient(135deg, #1e1b4b, #4c1d95, #0f172a)",
    font: "'Raleway', sans-serif", ornament: "✧",
    title: "Happy New Year! 🎆", recipient: "Everyone", sender: "Wish With Me",
    accent: "#fde68a", textColor: "#fff",
    scenes: ["fireworks", "countdown", "reasons", "wishes"],
    countdown: "Counting down to midnight...",
    reasons: ["New energy ✨", "New opportunities", "Same amazing you", "2025 is yours"],
    wishes: [{ name: "Kojo", msg: "New year, new wins! 🚀" }, { name: "Efua", msg: "Best year yet coming! 🎆" }, { name: "Yaw", msg: "Let's goooo! 🎉" }],
    featureLabel: "Fireworks · Countdown · Reactions",
  },
  {
    id: "fathers", label: "Father's Day", emoji: "👔",
    bg: "linear-gradient(135deg, #1e40af, #2563eb, #0ea5e9)",
    font: "'Oswald', sans-serif", ornament: "◈",
    title: "To The Best Dad", recipient: "Dad", sender: "Your Son",
    accent: "#bae6fd", textColor: "#fff",
    scenes: ["reasons", "timeline", "slideshow", "wishes"],
    reasons: ["Your quiet strength", "Every lesson you taught", "Your patience with me", "Being my hero always"],
    events: [{ date: "1998", title: "Dad's first day 👔" }, { date: "2010", title: "Football every Sunday" }, { date: "2025", title: "Still my greatest teacher" }],
    slideColors: ["linear-gradient(135deg,#1e3a8a,#1d4ed8)", "linear-gradient(135deg,#1e40af,#3b82f6)", "linear-gradient(135deg,#0284c7,#38bdf8)"],
    wishes: [{ name: "Sis", msg: "Best dad in the world! 👔" }, { name: "Brother", msg: "Love you dad 💙" }],
    featureLabel: "Reasons · Timeline · Slideshow",
  },
  {
    id: "general", label: "General Love", emoji: "🌟",
    bg: "linear-gradient(135deg, #8b5cf6, #a855f7, #6366f1)",
    font: "'Nunito', sans-serif", ornament: "◆",
    title: "This One's For You", recipient: "My Person", sender: "Always Yours",
    accent: "#ddd6fe", textColor: "#fff",
    scenes: ["reactions", "wishes", "reasons", "slideshow"],
    wishes: [{ name: "Kofi", msg: "You deserve all the love! 🌟" }, { name: "Ama", msg: "Always rooting for you! 💜" }, { name: "Kweku", msg: "Forever in your corner ✨" }],
    reasons: ["Your rare spirit", "How you love deeply", "Your beautiful mind", "Simply being you"],
    slideColors: ["linear-gradient(135deg,#7c3aed,#8b5cf6)", "linear-gradient(135deg,#6d28d9,#a78bfa)", "linear-gradient(135deg,#4f46e5,#818cf8)"],
    featureLabel: "Reactions · Wishes · Slideshow",
  },
  {
    id: "valentine", label: "Valentine's Day", emoji: "💕",
    bg: "linear-gradient(135deg, #be185d, #e11d48, #f43f5e)",
    font: "'Playfair Display', serif", ornament: "♥",
    title: "Be My Valentine 💕", recipient: "My Heart", sender: "Forever Yours",
    accent: "#fda4af", textColor: "#fff",
    scenes: ["interactive", "poem", "reasons", "wishes"],
    poemLines: ["Loving you is effortless,", "Every moment, more and more,", "You're the one I choose always,", "Now and forever more."],
    reasons: ["The way you smile at me", "Your gentle soul", "Every kiss, every moment", "Choosing you every day"],
    wishes: [{ name: "Bestie", msg: "You two are goals! 💕" }, { name: "Mum", msg: "He's a keeper! 😍" }],
    interactiveLabels: { yes: "Yes, Forever! 💕", no: "Maybe Later" },
    featureLabel: "Interactive Proposal · Run-Away Button",
  },
];

// ─── LIVE TEMPLATE CARD ─────────────────────────────────────────

function LiveTemplateCard({ tpl, index }: { tpl: typeof TEMPLATES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCycling = () => {
    setHovered(true);
    setSceneIdx(0);
    timerRef.current = setInterval(() => {
      setSceneIdx(i => (i + 1) % tpl.scenes.length);
    }, 2200);
  };

  const stopCycling = () => {
    setHovered(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const currentScene = tpl.scenes[sceneIdx];

  const renderScene = () => {
    switch (currentScene) {
      case "slideshow":
        return <SlideShow slides={(tpl as any).slideColors || []} accent={tpl.accent} />;
      case "poem":
        return <AnimatedPoemScene lines={(tpl as any).poemLines || []} textColor={tpl.textColor} />;
      case "diploma":
        return <DiplomaScene name={tpl.recipient} year={(tpl as any).graduationYear || "2025"} badges={(tpl as any).badges || []} textColor={tpl.textColor} borderColor={tpl.accent} />;
      case "countdown":
        return <CountdownScene label={(tpl as any).countdown || "Counting down..."} textColor={tpl.textColor} />;
      case "candles":
        return <CandlesScene age={(tpl as any).age || 25} textColor={tpl.textColor} />;
      case "reasons":
        return <ReasonsScene reasons={(tpl as any).reasons || []} textColor={tpl.textColor} />;
      case "timeline":
        return <TimelineScene events={(tpl as any).events || []} textColor={tpl.textColor} />;
      case "wishes":
        return <WishesScene wishes={(tpl as any).wishes || []} textColor={tpl.textColor} />;
      case "interactive":
        return <InteractiveScene yesLabel={(tpl as any).interactiveLabels?.yes || "Yes!"} noLabel={(tpl as any).interactiveLabels?.no || "Maybe"} textColor={tpl.textColor} />;
      case "reactions":
        return <EmojiReactScene textColor={tpl.textColor} />;
      case "snow":
        return <SnowScene textColor={tpl.textColor} />;
      case "fireworks":
        return <FireworksScene textColor={tpl.textColor} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      onTouchStart={startCycling}
      onTouchEnd={stopCycling}
      className="relative rounded-3xl overflow-hidden flex-1 cursor-pointer select-none"
      style={{ minHeight: 480, background: tpl.bg }}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Hover glow ring */}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 2px ${tpl.accent}80, 0 0 40px ${tpl.accent}40` }} />
        )}
      </AnimatePresence>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} className="absolute text-base opacity-25"
            style={{ left: `${10 + i * 20}%`, top: "105%" }}
            animate={{ y: "-120%", opacity: [0, 0.35, 0] }}
            transition={{ duration: 5 + i, delay: i * 0.7, repeat: Infinity, ease: "linear" }}>
            {tpl.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full p-5" style={{ minHeight: 480 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: tpl.textColor }}>
            {tpl.label}
          </span>
          <span className="text-xl">{tpl.emoji}</span>
        </div>

        {/* Ornament */}
        <div className="flex items-center gap-2 mb-3 opacity-40">
          <div className="h-px flex-1" style={{ background: tpl.textColor }} />
          <span style={{ color: tpl.textColor, fontSize: 11 }}>{tpl.ornament}</span>
          <div className="h-px flex-1" style={{ background: tpl.textColor }} />
        </div>

        {/* Title (always visible) */}
        <h3 className="font-bold text-xl leading-tight mb-0.5 drop-shadow"
          style={{ color: tpl.textColor, fontFamily: tpl.font }}>
          {tpl.title}
        </h3>
        <p className="text-xs mb-3 opacity-60" style={{ color: tpl.textColor, fontFamily: tpl.font }}>
          Dear {tpl.recipient},
        </p>

        {/* Scene area */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <AnimatePresence mode="wait">
            {!hovered ? (
              /* Static state — idle */
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-2">
                <div className="rounded-xl p-3 text-xs leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.12)", color: tpl.textColor }}>
                  Hover to preview this card...
                </div>
                <div className="flex flex-wrap gap-1">
                  {tpl.scenes.map(s => (
                    <span key={s} className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.12)", color: tpl.textColor, opacity: 0.7 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Active — show scenes */
              <motion.div key={currentScene} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                {renderScene()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scene dots */}
        {hovered && (
          <div className="flex justify-center gap-1 mt-3">
            {tpl.scenes.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${i === sceneIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: `${tpl.textColor}20` }}>
          <span className="text-[10px] opacity-40" style={{ color: tpl.textColor }}>{tpl.featureLabel}</span>
          <div className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)", color: tpl.textColor }}>
            GH₵ 50
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── TEMPLATE SETS (3 per rotation) ────────────────────────────

const SETS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

// ─── MAIN PAGE ──────────────────────────────────────────────────

export default function HomePage() {
  const [setIndex, setSetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setSetIndex(i => (i + 1) % SETS.length);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const progress = ((60 - timeLeft) / 60) * 100;
  const currentTemplates = SETS[setIndex].map(i => TEMPLATES[i]);

  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-violet-600 rounded-xl"><Gift size={16} className="text-white" /></div>
          <span className="font-bold text-white text-sm">Wish With Me</span>
        </div>
        <Link href="/admin" className="text-xs font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1">
          Admin <ChevronRight size={12} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-10 px-5 md:px-8 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 tracking-wide">
            <Sparkles size={12} /> Digital Greeting Cards · GH₵ 50 per card
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 tracking-tight">
            Make Your Loved Ones{" "}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Feel Everything</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white/55 max-w-xl mx-auto mb-8 leading-relaxed">
            Animated cards with music, photos, video and interactive effects — shared as a link.
          </motion.p>
          <motion.a initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            href="#templates"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm">
            <Star size={15} className="text-violet-600" /> View Templates
          </motion.a>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Live Previews</p>
              <h2 className="text-2xl md:text-3xl font-bold">Hover any card to see it come alive</h2>
              <p className="text-white/40 text-sm mt-1">Slideshows, poems, candles, diplomas, reactions and more — all interactive.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex gap-1.5">
                {SETS.map((_, i) => (
                  <button key={i} onClick={() => { setSetIndex(i); setTimeLeft(60); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === setIndex ? "w-8 bg-violet-400" : "w-3 bg-white/20 hover:bg-white/40"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#a78bfa" strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.9s linear" }} />
                </svg>
                <span className="text-xs text-white/50 font-mono tabular-nums w-5">{timeLeft}s</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={setIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTemplates.map((tpl, i) => (
                <LiveTemplateCard key={tpl.id} tpl={tpl} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mt-8 text-center">
            <p className="text-white/35 text-sm mb-4">Like what you see? DM to order — ready within 24 hours.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/+233269219920?text=Hi%2C%20I%20want%20to%20order%20a%20Wish%20With%20Me%20card%20%F0%9F%8E%81" target="_blank"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl text-sm transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                💬 Order on WhatsApp
              </a>
              <a href="https://instagram.com/kwekuwiththemenace" target="_blank"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm transition-all hover:scale-105 shadow-lg shadow-pink-500/30">
                📸 Follow on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 py-14 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-9">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Everything packed into one link</h2>
            <p className="text-white/40 text-sm">Opens in their browser. No app. No download.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-4 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 transition-all group">
                <div className="p-2 bg-violet-600/20 rounded-xl w-fit mb-3 group-hover:bg-violet-600/30 transition-colors">
                  <f.icon size={16} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-8 py-14 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Three steps. One magic moment.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "You order", desc: "DM us with the occasion, names, message and any photos or music" },
              { step: "02", title: "We build", desc: "Your card is designed and ready within 24 hours" },
              { step: "03", title: "They feel it", desc: "Share the link. They open it and experience everything" },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-sm shadow-lg shadow-violet-500/30">
                  {s.step}
                </div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-8 py-14">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center p-10 md:p-14 rounded-3xl bg-gradient-to-br from-violet-600/20 to-pink-600/15 border border-violet-500/20">
          <div className="text-5xl mb-5">💌</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to make someone's day?</h2>
          <p className="text-white/50 text-sm mb-2">GH₵ 50 per card · Ready in 24 hours · Shared as a link</p>
          <p className="text-white/25 text-xs mb-8">Birthdays · Valentine's · Graduations · Mother's Day · Christmas · New Year</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/+233269219920?text=Hi%2C%20I%20want%20to%20order%20a%20Wish%20With%20Me%20card%20%F0%9F%8E%81" target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl text-sm">
              <Gift size={16} /> Order on WhatsApp — GH₵ 50
            </a>
            <a href="https://instagram.com/kwekuwiththemenace" target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-pink-500/20 text-sm">
              📸 @kwekuwiththemenace
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <a href="https://wa.me/+233269219920" target="_blank"
              className="text-xs text-white/30 hover:text-green-400 transition-colors">💬 +233 26 921 9920</a>
            <span className="text-white/10">·</span>
            <a href="https://instagram.com/kwekuwiththemenace" target="_blank"
              className="text-xs text-white/30 hover:text-pink-400 transition-colors">📸 @kwekuwiththemenace</a>
          </div>
          <p className="text-xs text-white/15">Wish With Me · Digital Greeting Cards · Ghana · {new Date().getFullYear()}</p>
          <p className="text-xs text-white/10 mt-1">
            Designed & built by{" "}
            <a href="https://instagram.com/kwekuwiththemenace" target="_blank"
              className="text-white/25 hover:text-violet-400 transition-colors font-medium">
              Daniel Ansah Djoleto
            </a>
            {" "}·{" "}
            <span className="text-white/15">@kwekuwiththemenace</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
