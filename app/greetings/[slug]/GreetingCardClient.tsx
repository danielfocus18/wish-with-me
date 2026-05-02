"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Heart, Share2, Check, RefreshCw } from "lucide-react";
import { Greeting, ThemeConfig, ColorCustomization } from "@/types";
import Slideshow from "@/components/greeting/Slideshow";
import AudioPlayer from "@/components/greeting/AudioPlayer";
import VideoEmbed from "@/components/greeting/VideoEmbed";
import VideoPlayer from "@/components/greeting/VideoPlayer";
import LoadingScreen from "@/components/greeting/LoadingScreen";
import MusicPrompt from "@/components/greeting/MusicPrompt";
import PullQuote from "@/components/greeting/PullQuote";
import BackgroundVideo from "@/components/greeting/BackgroundVideo";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("@/components/greeting/Confetti"), { ssr: false });

interface Props { greeting: Greeting; theme: ThemeConfig; }

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const floatingParticles = Array.from({ length: 8 }, (_, i) => ({
  id: i, x: 5 + i * 12,
  delay: i * 0.5, duration: 5 + i * 0.7, size: 14 + (i % 3) * 8,
}));

export default function GreetingCardClient({ greeting, theme }: Props) {
  const [phase, setPhase] = useState<"loading" | "music" | "open">("loading");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [key, setKey] = useState(0); // for replay

  const colors: ColorCustomization | null = (greeting as any).color_customization || null;
  const useCustom = colors?.useCustomColors === true;
  const extras = greeting as any;
  const hasBgVideo = extras.use_background_video && extras.uploaded_video_url;
  const hasMusic = !!greeting.background_music_url;
  const pullQuote: string = extras.pull_quote || "";
  const ctaYes: string = extras.cta_yes_label || "Send Love";
  const ctaNo: string = extras.cta_no_label || "Share This Card";

  const bgClass = useCustom ? "" : (hasBgVideo ? "" : theme.bg);
  const bgStyle: React.CSSProperties = useCustom && !hasBgVideo
    ? { background: `linear-gradient(135deg, ${colors!.bgFrom}, ${colors!.bgVia}, ${colors!.bgTo})` }
    : {};
  const textStyle: React.CSSProperties = useCustom ? { color: colors!.textColor } : {};
  const textClass = useCustom ? "" : theme.text;
  const cardBgStyle: React.CSSProperties = useCustom
    ? { background: colors!.cardBg, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }
    : {};
  const cardBgClass = useCustom ? "" : `${theme.cardBg} border border-white/20`;

  const handleLoadComplete = useCallback(() => {
    if (hasMusic) {
      setPhase("music");
    } else {
      setPhase("open");
      if (greeting.show_confetti) setTimeout(() => setConfettiActive(true), 300);
    }
  }, [hasMusic, greeting.show_confetti]);

  const handleMusicEnable = () => {
    setMusicEnabled(true);
    setAudioReady(true);
    setPhase("open");
    if (greeting.show_confetti) setTimeout(() => setConfettiActive(true), 300);
  };

  const handleMusicSkip = () => {
    setMusicEnabled(false);
    setPhase("open");
    if (greeting.show_confetti) setTimeout(() => setConfettiActive(true), 300);
  };

  const handleReplay = () => {
    setPhase("loading");
    setConfettiActive(false);
    setHearted(false);
    setMusicEnabled(false);
    setKey(k => k + 1);
  };

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

  const isOpen = phase === "open";

  return (
    <div
      key={key}
      className={`min-h-screen relative overflow-hidden ${bgClass}`}
      style={hasBgVideo ? {} : bgStyle}
    >
      {/* Background video (silent, looping) */}
      {hasBgVideo && <BackgroundVideo src={extras.uploaded_video_url} />}

      {/* Gradient overlay when no bg video */}
      {!hasBgVideo && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {floatingParticles.map(p => (
            <motion.div key={p.id}
              initial={{ y: "110vh", opacity: 0, x: `${p.x}vw` }}
              animate={{ y: "-10vh", opacity: [0, 0.55, 0.55, 0], x: [`${p.x}vw`, `${p.x + 4}vw`] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", fontSize: p.size }}
            >
              {theme.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Loading screen */}
      <LoadingScreen
        key={`loading-${key}`}
        recipientName={greeting.recipient_name}
        themeEmoji={theme.emoji}
        bgClass={bgClass}
        bgStyle={hasBgVideo ? {} : bgStyle}
        onComplete={handleLoadComplete}
      />

      {/* Music prompt */}
      <MusicPrompt
        show={phase === "music"}
        onEnable={handleMusicEnable}
        onSkip={handleMusicSkip}
      />

      {/* Confetti */}
      {confettiActive && greeting.show_confetti && (
        <Confetti colors={useCustom
          ? [colors!.bgFrom, colors!.bgTo, "#ffffff"]
          : [theme.particle, "#ffffff"]}
        />
      )}

      {/* Main card */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-16 max-w-3xl mx-auto"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="text-center mb-8 w-full">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl md:text-7xl mb-5"
          >
            {theme.emoji}
          </motion.div>
          <h1 className={`text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg mb-3 ${textClass}`}
            style={textStyle}>
            {greeting.title}
          </h1>
          <p className={`text-base md:text-lg opacity-80 ${textClass}`} style={textStyle}>
            A special message for <span className="font-bold">{greeting.recipient_name}</span>
          </p>
        </motion.div>

        {/* Audio player — only shows if music was enabled */}
        {hasMusic && musicEnabled && audioReady && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <AudioPlayer src={greeting.background_music_url!} autoPlay={musicEnabled} />
          </motion.div>
        )}

        {/* Slideshow */}
        {greeting.image_urls?.length > 0 && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <Slideshow images={greeting.image_urls} />
          </motion.div>
        )}

        {/* Message card */}
        <motion.div variants={itemVariants}
          className={`w-full rounded-3xl p-6 md:p-8 mb-6 shadow-2xl ${cardBgClass}`}
          style={cardBgStyle}
        >
          <div className="flex items-start gap-3 mb-4">
            <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <Heart size={20} className={`fill-current opacity-70 ${textClass}`} style={textStyle} />
            </motion.div>
            <h2 className={`text-lg font-bold ${textClass}`} style={textStyle}>
              Dear {greeting.recipient_name},
            </h2>
          </div>

          <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${textClass}`} style={textStyle}>
            {greeting.message}
          </p>

          {/* Pull quote */}
          {pullQuote && (
            <div className="mt-6">
              <PullQuote quote={pullQuote} textClass={textClass} textStyle={textStyle} />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/20 text-right">
            <p className={`text-sm opacity-60 ${textClass}`} style={textStyle}>Forever yours,</p>
            <p className={`text-xl font-bold ${textClass}`} style={textStyle}>{greeting.sender_name}</p>
          </div>
        </motion.div>

        {/* Inline video player (non-background mode) */}
        {!hasBgVideo && extras.uploaded_video_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <VideoPlayer src={extras.uploaded_video_url} />
          </motion.div>
        )}

        {/* YouTube/Vimeo embed */}
        {greeting.video_url && (
          <motion.div variants={itemVariants} className="w-full mb-6">
            <VideoEmbed url={greeting.video_url} />
          </motion.div>
        )}

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <motion.button whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}
            onClick={() => setHearted(!hearted)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 ${textClass} ${hearted ? "bg-red-500/40 border-red-400/60" : ""}`}
            style={textStyle}
          >
            <motion.div animate={hearted ? { scale: [1, 1.5, 1] } : {}}>
              <Heart size={18} className={hearted ? "fill-red-300 text-red-300" : ""} />
            </motion.div>
            {hearted ? "💕 " + ctaYes + "!" : ctaYes}
          </motion.button>

          <motion.button whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}
            onClick={handleShare}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 ${textClass}`}
            style={textStyle}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? "Copied! 🎉" : ctaNo}
          </motion.button>
        </motion.div>

        {/* Experience Again */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleReplay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 border border-white/20 backdrop-blur-sm transition-all ${textClass}`}
            style={textStyle}
          >
            <RefreshCw size={14} />
            Experience Again
          </motion.button>

          <p className={`text-xs opacity-30 ${textClass}`} style={textStyle}>
            Made with ❤️ by{" "}
            <a href="/" className="hover:opacity-60 underline underline-offset-2">Wish With Me</a>
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
