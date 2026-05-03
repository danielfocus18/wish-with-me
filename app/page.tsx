"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Heart, Music, Image, Video, Sparkles, Star, ChevronRight, Zap } from "lucide-react";

const themes = [
  { emoji: "🎂", label: "Birthday", color: "from-purple-500 to-pink-500" },
  { emoji: "❤️", label: "Valentine's", color: "from-rose-500 to-red-500" },
  { emoji: "🎓", label: "Graduation", color: "from-yellow-600 to-amber-500" },
  { emoji: "🌷", label: "Mother's Day", color: "from-pink-400 to-fuchsia-500" },
  { emoji: "👔", label: "Father's Day", color: "from-blue-600 to-sky-500" },
  { emoji: "🎄", label: "Christmas", color: "from-green-700 to-red-600" },
  { emoji: "🎆", label: "New Year", color: "from-purple-900 to-indigo-800" },
  { emoji: "🌟", label: "General", color: "from-violet-500 to-indigo-500" },
];

const features = [
  { icon: Sparkles, title: "Animated Themes", desc: "8 stunning themes with live color customization and particle effects" },
  { icon: Image, title: "Photo Slideshow", desc: "Upload multiple photos that auto-play as a beautiful slideshow" },
  { icon: Music, title: "Background Music", desc: "Add an MP3 that plays when your loved one opens the card" },
  { icon: Video, title: "Video Support", desc: "Upload a video or embed YouTube — even use it as a background" },
  { icon: Zap, title: "Interactive Mode", desc: "Yes/No buttons with run-away, shrink & countdown effects" },
  { icon: Heart, title: "Personal Message", desc: "Rich personalized messages with pull quotes and custom CTAs" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-violet-600 rounded-xl">
            <Gift size={18} className="text-white" />
          </div>
          <span className="font-bold text-white">Wish With Me</span>
        </div>
        <Link href="/admin"
          className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors">
          Admin <ChevronRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-2xl" />
        </div>

        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            <Sparkles size={14} />
            Digital Greeting Cards That Actually Feel Special
          </motion.div>

          <motion.h1 variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
            Make Your<br />Loved Ones<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Feel Everything</span>
          </motion.h1>

          <motion.p variants={itemVariants}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Animated greeting cards with music, slideshows, video, and interactive effects.
            Share a link. Watch them smile.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin"
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 text-sm">
              Create a Card →
            </Link>
          </motion.div>

          {/* Theme pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mt-12">
            {themes.map(t => (
              <div key={t.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${t.color} text-white text-xs font-semibold shadow-md`}>
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything a card should be
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">
              Not a static image. A living, breathing experience they'll share and remember.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all group"
              >
                <div className="p-2.5 bg-violet-600/20 rounded-xl w-fit mb-4 group-hover:bg-violet-600/30 transition-colors">
                  <f.icon size={20} className="text-violet-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white/2">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-16">
            Three steps. One magic moment.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Design", desc: "Choose a theme, upload photos, add music and your message" },
              { step: "02", title: "Publish", desc: "Hit publish and get a unique shareable link instantly" },
              { step: "03", title: "Share", desc: "Send the link — they open it and experience everything you built" },
            ].map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-lg shadow-lg shadow-violet-500/30">
                  {s.step}
                </div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/20"
        >
          <div className="text-5xl mb-6">💌</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make someone's day?</h2>
          <p className="text-white/60 mb-8">Create your first greeting card in under 5 minutes.</p>
          <Link href="/admin"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
            <Gift size={18} />
            Start Creating
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/30">
          Made with ❤️ by Wish With Me · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
