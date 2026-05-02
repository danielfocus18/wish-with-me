"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Copy, Check } from "lucide-react";
import { Greeting, ThemeConfig } from "@/types";
import Slideshow from "@/components/greeting/Slideshow";
import AudioPlayer from "@/components/greeting/AudioPlayer";
import VideoEmbed from "@/components/greeting/VideoEmbed";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("@/components/greeting/Confetti"), {
  ssr: false,
});

interface Props {
  greeting: Greeting;
  theme: ThemeConfig;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

import type { Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const floatingHearts = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 4 + Math.random() * 4,
  size: 12 + Math.random() * 16,
}));

export default function GreetingCardClient({ greeting, theme }: Props) {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const [hearted, setHearted] = useState(false);

  useEffect(() => {
    // Animate envelope open
    const t = setTimeout(() => setOpened(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: greeting.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden`}>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: "110vh", opacity: 0, x: `${h.x}vw` }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.6, 0.6, 0],
              x: [`${h.x}vw`, `${h.x + (Math.random() - 0.5) * 10}vw`],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ position: "absolute", fontSize: h.size }}
          >
            {theme.emoji}
          </motion.div>
        ))}
      </div>

      {/* Confetti */}
      {greeting.show_confetti && opened && (
        <Confetti colors={[theme.particle, "#ffffff", "#f0f0f0"]} />
      )}

      {/* Envelope opening animation */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: 1 }}
              className="text-8xl md:text-9xl"
            >
              💌
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={opened ? "visible" : "hidden"}
        className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-16 max-w-3xl mx-auto"
      >
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 w-full">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl md:text-7xl mb-4"
          >
            {theme.emoji}
          </motion.div>

          <h1
            className={`text-3xl md:text-5xl lg:text-6xl font-extrabold ${theme.text} leading-tight drop-shadow-lg mb-3`}
            style={{ fontFamily: "inherit" }}
          >
            {greeting.title}
          </h1>
          <p className={`text-base md:text-lg ${theme.text} opacity-80`}>
            A special message for{" "}
            <span className="font-bold">{greeting.recipient_name}</span>
          </p>
        </motion.div>

        {/* Audio Player */}
        {greeting.background_music_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <AudioPlayer src={greeting.background_music_url} autoPlay />
          </motion.div>
        )}

        {/* Image Slideshow */}
        {greeting.image_urls.length > 0 && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <Slideshow images={greeting.image_urls} />
          </motion.div>
        )}

        {/* Message Card */}
        <motion.div
          variants={itemVariants}
          className={`w-full ${theme.cardBg} rounded-3xl p-6 md:p-8 mb-6 border border-white/20 shadow-2xl`}
        >
          <div className="flex items-start gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={20} className={`${theme.text} opacity-70 fill-current`} />
            </motion.div>
            <h2 className={`text-lg font-bold ${theme.text}`}>
              Dear {greeting.recipient_name},
            </h2>
          </div>

          <p
            className={`text-base md:text-lg ${theme.text} leading-relaxed whitespace-pre-wrap`}
          >
            {greeting.message}
          </p>

          <div className={`mt-6 pt-4 border-t border-white/20 text-right`}>
            <p className={`text-sm ${theme.text} opacity-70`}>With love,</p>
            <p className={`text-lg font-bold ${theme.text}`}>
              {greeting.sender_name}
            </p>
          </div>
        </motion.div>

        {/* Video Embed */}
        {greeting.video_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <VideoEmbed url={greeting.video_url} />
          </motion.div>
        )}

        {/* Interaction buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 w-full"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setHearted(!hearted)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm
              bg-white/20 backdrop-blur-sm border border-white/30 ${theme.text}
              transition-all duration-200
              ${hearted ? "bg-red-500/30 border-red-400/50" : ""}
            `}
          >
            <motion.div animate={hearted ? { scale: [1, 1.4, 1] } : {}}>
              <Heart
                size={18}
                className={hearted ? "fill-red-400 text-red-400" : ""}
              />
            </motion.div>
            {hearted ? "Loved it! 💕" : "Send Love"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleShare}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm
              bg-white/20 backdrop-blur-sm border border-white/30 ${theme.text}
              transition-all duration-200
            `}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? "Link Copied!" : "Share This Card"}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className={`text-xs ${theme.text} opacity-40`}>
            Made with ❤️ by{" "}
            <a
              href="/"
              className="hover:opacity-70 underline underline-offset-2"
            >
              Wish With Me
            </a>
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
