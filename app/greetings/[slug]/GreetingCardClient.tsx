"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Heart, Share2, Check } from "lucide-react";
import { Greeting, ThemeConfig, ColorCustomization } from "@/types";
import Slideshow from "@/components/greeting/Slideshow";
import AudioPlayer from "@/components/greeting/AudioPlayer";
import VideoEmbed from "@/components/greeting/VideoEmbed";
import VideoPlayer from "@/components/greeting/VideoPlayer";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("@/components/greeting/Confetti"), { ssr: false });

interface Props {
  greeting: Greeting;
  theme: ThemeConfig;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const floatingParticles = Array.from({ length: 8 }, (_, i) => ({
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

  const colors: ColorCustomization | null = (greeting as any).color_customization || null;
  const useCustom = colors?.useCustomColors === true;

  // Compute styles
  const bgClass = useCustom ? "" : theme.bg;
  const bgStyle = useCustom
    ? { background: `linear-gradient(135deg, ${colors!.bgFrom}, ${colors!.bgVia}, ${colors!.bgTo})` }
    : {};
  const textStyle = useCustom ? { color: colors!.textColor } : {};
  const textClass = useCustom ? "" : theme.text;
  const cardBgStyle = useCustom
    ? { background: colors!.cardBg, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }
    : {};
  const cardBgClass = useCustom ? "" : `${theme.cardBg} border border-white/20`;

  useEffect(() => {
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
    <div className={`min-h-screen relative overflow-hidden ${bgClass}`} style={bgStyle}>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", opacity: 0, x: `${p.x}vw` }}
            animate={{ y: "-10vh", opacity: [0, 0.6, 0.6, 0], x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 10}vw`] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", fontSize: p.size }}
          >
            {theme.emoji}
          </motion.div>
        ))}
      </div>

      {/* Confetti */}
      {greeting.show_confetti && opened && (
        <Confetti colors={useCustom ? [colors!.bgFrom, colors!.bgTo, "#ffffff"] : [theme.particle, "#ffffff"]} />
      )}

      {/* Envelope open */}
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

      {/* Main content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={opened ? "visible" : "hidden"}
        className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-16 max-w-3xl mx-auto"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="text-center mb-8 w-full">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl md:text-7xl mb-4"
          >
            {theme.emoji}
          </motion.div>
          <h1
            className={`text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg mb-3 ${textClass}`}
            style={textStyle}
          >
            {greeting.title}
          </h1>
          <p className={`text-base md:text-lg opacity-80 ${textClass}`} style={textStyle}>
            A special message for <span className="font-bold">{greeting.recipient_name}</span>
          </p>
        </motion.div>

        {/* Audio */}
        {greeting.background_music_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <AudioPlayer src={greeting.background_music_url} autoPlay />
          </motion.div>
        )}

        {/* Slideshow */}
        {greeting.image_urls?.length > 0 && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <Slideshow images={greeting.image_urls} />
          </motion.div>
        )}

        {/* Message Card */}
        <motion.div
          variants={itemVariants}
          className={`w-full rounded-3xl p-6 md:p-8 mb-6 shadow-2xl ${cardBgClass}`}
          style={cardBgStyle}
        >
          <div className="flex items-start gap-3 mb-4">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Heart size={20} className={`fill-current opacity-70 ${textClass}`} style={textStyle} />
            </motion.div>
            <h2 className={`text-lg font-bold ${textClass}`} style={textStyle}>
              Dear {greeting.recipient_name},
            </h2>
          </div>
          <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${textClass}`} style={textStyle}>
            {greeting.message}
          </p>
          <div className="mt-6 pt-4 border-t border-white/20 text-right">
            <p className={`text-sm opacity-70 ${textClass}`} style={textStyle}>With love,</p>
            <p className={`text-lg font-bold ${textClass}`} style={textStyle}>{greeting.sender_name}</p>
          </div>
        </motion.div>

        {/* Uploaded video */}
        {(greeting as any).uploaded_video_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <VideoPlayer src={(greeting as any).uploaded_video_url} />
          </motion.div>
        )}

        {/* YouTube/Vimeo embed */}
        {greeting.video_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <VideoEmbed url={greeting.video_url} />
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setHearted(!hearted)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 ${textClass} ${hearted ? "bg-red-500/30 border-red-400/50" : ""}`}
            style={textStyle}
          >
            <motion.div animate={hearted ? { scale: [1, 1.4, 1] } : {}}>
              <Heart size={18} className={hearted ? "fill-red-400 text-red-400" : ""} />
            </motion.div>
            {hearted ? "Loved it! 💕" : "Send Love"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleShare}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 ${textClass}`}
            style={textStyle}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? "Link Copied!" : "Share This Card"}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className={`text-xs opacity-40 ${textClass}`} style={textStyle}>
            Made with ❤️ by{" "}
            <a href="/" className="hover:opacity-70 underline underline-offset-2">Wish With Me</a>
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
