"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, Sparkles, Star, Zap, Image, Music, Video, Heart, ChevronRight, ExternalLink } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Animated Themes", desc: "8 stunning themes with live color customization" },
  { icon: Image, title: "Photo Slideshow", desc: "Multiple photos in an auto-playing gallery" },
  { icon: Music, title: "Background Music", desc: "Their song plays the moment they open it" },
  { icon: Video, title: "Video Messages", desc: "Upload personal videos or play behind the card" },
  { icon: Zap, title: "Interactive Mode", desc: "Yes/No buttons with run-away & countdown effects" },
  { icon: Heart, title: "Wishes Wall", desc: "Friends leave messages from the shared link" },
];

// 9 templates in 3 rotating sets of 3
const TEMPLATE_SETS = [
  [
    {
      theme: "romantic-red",
      label: "Romantic Red",
      emoji: "❤️",
      bg: "from-rose-600 via-red-500 to-pink-400",
      font: "'Playfair Display', serif",
      ornament: "♥",
      title: "Will You Be Mine?",
      recipient: "My Love",
      message: "Every moment with you feels like a dream I never want to wake from. You are my forever and always.",
      sender: "Your Daniel",
      features: ["Music", "Interactive Yes/No", "Photo Slideshow"],
      accent: "#fb7185",
    },
    {
      theme: "birthday-fun",
      label: "Birthday Fun",
      emoji: "🎂",
      bg: "from-purple-500 via-pink-400 to-yellow-300",
      font: "'Pacifico', cursive",
      ornament: "🎈",
      title: "Happy Birthday!",
      recipient: "Sarah",
      message: "Another year of you making the world brighter, louder and so much more fun. Here's to 25! 🎉",
      sender: "The Squad",
      features: ["Confetti", "Candle Animation", "Wishes Wall"],
      accent: "#f59e0b",
    },
    {
      theme: "graduation-gold",
      label: "Graduation Gold",
      emoji: "🎓",
      bg: "from-yellow-700 via-yellow-500 to-amber-300",
      font: "'Merriweather', serif",
      ornament: "★",
      title: "You Did It! 🎓",
      recipient: "James",
      message: "Years of hard work, sleepless nights and relentless dedication — and now you've made it. We couldn't be prouder.",
      sender: "Mum & Dad",
      features: ["Diploma Block", "Achievement Badges", "Countdown"],
      accent: "#f59e0b",
    },
  ],
  [
    {
      theme: "mothers-day",
      label: "Mother's Day",
      emoji: "🌷",
      bg: "from-pink-300 via-rose-200 to-fuchsia-300",
      font: "'Dancing Script', cursive",
      ornament: "❀",
      title: "For The Best Mum",
      recipient: "Mum",
      message: "No words will ever be enough, but I hope this card carries even a fraction of what you mean to me. I love you endlessly.",
      sender: "Your Baby",
      features: ["Photo Memories", "Animated Poem", "Reasons List"],
      accent: "#f472b6",
    },
    {
      theme: "christmas-joy",
      label: "Christmas Joy",
      emoji: "🎄",
      bg: "from-green-800 via-green-600 to-red-500",
      font: "'Mountains of Christmas', cursive",
      ornament: "✦",
      title: "Merry Christmas! 🎄",
      recipient: "The Family",
      message: "May this season fill your home with warmth, your heart with joy, and your table with all the good things. With so much love.",
      sender: "Daniel & Family",
      features: ["Snow Overlay", "Countdown to Christmas", "Wishes Wall"],
      accent: "#ef4444",
    },
    {
      theme: "new-year-glow",
      label: "New Year Glow",
      emoji: "🎆",
      bg: "from-slate-900 via-purple-900 to-slate-800",
      font: "'Raleway', sans-serif",
      ornament: "✧",
      title: "Happy New Year! 🎆",
      recipient: "Everyone",
      message: "New chapter. New energy. Same unstoppable you. Here's to 2025 being everything you've been building towards.",
      sender: "Wish With Me",
      features: ["Fireworks", "Year in Review", "Countdown Timer"],
      accent: "#facc15",
    },
  ],
  [
    {
      theme: "fathers-day",
      label: "Father's Day",
      emoji: "👔",
      bg: "from-blue-800 via-blue-600 to-sky-400",
      font: "'Oswald', sans-serif",
      ornament: "◈",
      title: "To The Best Dad",
      recipient: "Dad",
      message: "You taught me strength, patience, and how to show up for the people I love. Everything good in me started with you.",
      sender: "Your Son",
      features: ["Memory Timeline", "Reasons List", "Photo Slideshow"],
      accent: "#38bdf8",
    },
    {
      theme: "general-love",
      label: "General Love",
      emoji: "🌟",
      bg: "from-violet-500 via-purple-500 to-indigo-500",
      font: "'Nunito', sans-serif",
      ornament: "◆",
      title: "This One's For You 🌟",
      recipient: "My Person",
      message: "Sometimes the most ordinary days with you become the ones I cherish most. Thank you for being exactly who you are.",
      sender: "Always Yours",
      features: ["Emoji Reactions", "Wishes Wall", "Music"],
      accent: "#a78bfa",
    },
    {
      theme: "romantic-red",
      label: "Valentine's Day",
      emoji: "💕",
      bg: "from-rose-500 via-pink-500 to-red-400",
      font: "'Playfair Display', serif",
      ornament: "♥",
      title: "Be My Valentine 💕",
      recipient: "My Heart",
      message: "Loving you is the easiest thing I have ever done. You are my favourite person in every room, in every moment, always.",
      sender: "Forever Yours",
      features: ["Interactive Proposal", "Run-Away Button", "Music"],
      accent: "#fb7185",
    },
  ],
];

function TemplateCard({ tpl, index }: { tpl: typeof TEMPLATE_SETS[0][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden flex-1 min-w-0 shadow-2xl"
      style={{ minHeight: "480px" }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tpl.bg}`} />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-white/5" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i}
            className="absolute text-lg opacity-30"
            style={{ left: `${10 + i * 20}%`, top: "100%" }}
            animate={{ y: "-120%", opacity: [0, 0.4, 0] }}
            transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity, ease: "linear" }}>
            {tpl.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full p-5 md:p-6">
        {/* Theme badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1 rounded-full">
            {tpl.label}
          </span>
          <span className="text-2xl">{tpl.emoji}</span>
        </div>

        {/* Ornament divider */}
        <div className="flex items-center gap-2 mb-3 opacity-50">
          <div className="h-px flex-1 bg-white/40" />
          <span className="text-white text-xs">{tpl.ornament}</span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-xl md:text-2xl leading-tight mb-1 drop-shadow"
          style={{ fontFamily: tpl.font }}>
          {tpl.title}
        </h3>

        <p className="text-white/60 text-xs mb-4" style={{ fontFamily: tpl.font }}>
          Dear {tpl.recipient},
        </p>

        {/* Message card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20 flex-1">
          <p className="text-white/90 text-sm leading-relaxed line-clamp-4">
            {tpl.message}
          </p>
          <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="text-white/40 text-xs">with love,</span>
            <span className="text-white text-xs font-bold" style={{ fontFamily: tpl.font }}>{tpl.sender}</span>
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tpl.features.map(f => (
            <span key={f} className="text-xs bg-white/15 border border-white/20 text-white/80 px-2 py-0.5 rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Get this card</span>
          <ChevronRight size={12} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [setIndex, setSetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsTransitioning(true);
          setTimeout(() => {
            setSetIndex(i => (i + 1) % TEMPLATE_SETS.length);
            setIsTransitioning(false);
          }, 300);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const currentSet = TEMPLATE_SETS[setIndex];
  const progress = ((60 - timeLeft) / 60) * 100;

  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-violet-600 rounded-xl">
            <Gift size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">Wish With Me</span>
        </div>
        <Link href="/admin"
          className="text-xs font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1">
          Admin <ChevronRight size={12} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-12 px-5 md:px-8 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 tracking-wide">
            <Sparkles size={12} /> Digital Greeting Cards · GH₵ 100 per card
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 tracking-tight">
            Make Your<br />Loved Ones{" "}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Feel Everything
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white/55 max-w-xl mx-auto mb-8 leading-relaxed">
            Animated cards with music, photos, video and interactive effects — shared as a link. No app needed.
          </motion.p>
          <motion.a initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            href="#templates"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm">
            <Star size={15} className="text-violet-600" />
            View Templates
          </motion.a>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Live Previews</p>
              <h2 className="text-2xl md:text-3xl font-bold">See what your card could look like</h2>
              <p className="text-white/45 text-sm mt-1">Real cards. Real designs. What your recipient actually sees.</p>
            </div>

            {/* Timer + set indicator */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex gap-1.5">
                {TEMPLATE_SETS.map((_, i) => (
                  <button key={i} onClick={() => { setSetIndex(i); setTimeLeft(60); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === setIndex ? "w-8 bg-violet-400" : "w-3 bg-white/20 hover:bg-white/40"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                {/* Progress ring */}
                <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#a78bfa" strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.9s linear" }} />
                </svg>
                <span className="text-xs text-white/50 font-mono tabular-nums w-5">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div key={setIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {currentSet.map((tpl, i) => (
                  <TemplateCard key={tpl.theme + tpl.title} tpl={tpl} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order CTA beneath templates */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-4">
              Like what you see? DM to order your card — ready within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/?text=Hi%2C%20I%20want%20to%20order%20a%20Wish%20With%20Me%20card%20%F0%9F%8E%81"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl text-sm transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                💬 Order on WhatsApp
              </a>
              <a href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-2xl text-sm transition-all">
                <ExternalLink size={14} /> Admin Login
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Everything packed into one link</h2>
            <p className="text-white/45 text-sm">Your recipient opens it in their browser. No app. No download.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-4 md:p-5 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 transition-all group">
                <div className="p-2 bg-violet-600/20 rounded-xl w-fit mb-3 group-hover:bg-violet-600/30 transition-colors">
                  <f.icon size={16} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-8 py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-12">
            Three steps. One magic moment.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "You order", desc: "DM us with the occasion, names, message and any photos or music" },
              { step: "02", title: "We build", desc: "Your card is designed and ready within 24 hours — we send you the link" },
              { step: "03", title: "They feel it", desc: "Share the link. They open it and experience everything you put in" },
            ].map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-sm shadow-lg shadow-violet-500/30">
                  {s.step}
                </div>
                <h3 className="font-bold text-base">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-8 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center p-10 md:p-14 rounded-3xl bg-gradient-to-br from-violet-600/20 to-pink-600/15 border border-violet-500/20">
          <div className="text-5xl mb-5">💌</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to make someone's day?</h2>
          <p className="text-white/50 text-sm mb-3">GH₵ 100 per card · Ready in 24 hours · Shared as a link</p>
          <p className="text-white/30 text-xs mb-8">Birthdays · Valentine's · Graduations · Mother's Day · Christmas · New Year · Any Occasion</p>
          <a href="https://wa.me/?text=Hi%2C%20I%20want%20to%20order%20a%20Wish%20With%20Me%20card%20%F0%9F%8E%81"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl text-sm">
            <Gift size={16} />
            Order Your Card — GH₵ 100
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/25">
          Wish With Me · Digital Greeting Cards · Ghana · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
