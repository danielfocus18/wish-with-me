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
import InteractiveHero from "@/components/greeting/InteractiveHero";
import ReasonsList from "@/components/greeting/ReasonsList";
import MemoryTimeline from "@/components/greeting/MemoryTimeline";
import CountdownTimer from "@/components/greeting/CountdownTimer";
import AnimatedPoem from "@/components/greeting/AnimatedPoem";
import WishesWall from "@/components/greeting/WishesWall";
import EmojiReactions from "@/components/greeting/EmojiReactions";
import BirthdayBanner from "@/components/greeting/BirthdayBanner";
import GraduationBadges from "@/components/greeting/GraduationBadges";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("@/components/greeting/Confetti"), { ssr: false });
const SnowOverlay = dynamic(() => import("@/components/greeting/SnowOverlay"), { ssr: false });
const FireworksOverlay = dynamic(() => import("@/components/greeting/FireworksOverlay"), { ssr: false });

interface Props { greeting: Greeting; theme: ThemeConfig; }

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const floaters = Array.from({ length: 8 }, (_, i) => ({ id: i, x: 5 + i * 12, delay: i * 0.5, dur: 5 + i * 0.7, size: 14 + (i % 3) * 8 }));

export default function GreetingCardClient({ greeting, theme }: Props) {
  const [phase, setPhase] = useState<"loading" | "music" | "hero" | "open">("loading");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const revealRef = useRef<HTMLDivElement>(null);

  const ex = greeting as any;
  const colors: ColorCustomization | null = ex.color_customization || null;
  const useCustom = colors?.useCustomColors === true;

  // All fields
  const interactiveMode = ex.interactive_mode === true;
  const hasBgVideo = ex.use_background_video && ex.uploaded_video_url;
  const hasMusic = !!greeting.background_music_url;
  const pullQuote = ex.pull_quote || "";
  const ctaYes = ex.cta_yes_label || "Send Love";
  const ctaNo = ex.cta_no_label || "Share This Card";
  const reasons: string[] = ex.reasons_list || [];
  const reasonsTitle: string = ex.reasons_title || "Reasons Why 💕";
  const memories = ex.memory_timeline || [];
  const memoriesTitle = ex.memories_title || "Our Story 📅";
  const countdownDate = ex.countdown_date || null;
  const countdownLabel = ex.countdown_label || "";
  const poemLines: string[] = ex.poem_lines || [];
  const poemTitle = ex.poem_title || "";
  const enableWishesWall = ex.enable_wishes_wall === true;
  const wishesTitle = ex.wishes_title || "Leave a Wish 💌";
  const enableReactions = ex.enable_reactions !== false; // default true
  const ageMilestone = ex.age_milestone || null;
  const badges: string[] = ex.achievement_badges || [];
  const graduationYear = ex.graduation_year || "";
  const isChristmas = greeting.theme === "christmas-joy";
  const isNewYear = greeting.theme === "new-year-glow";
  const yearReview: string[] = ex.year_in_review || [];

  // Style helpers
  const bgClass = useCustom || hasBgVideo ? "" : theme.bg;
  const bgStyle: React.CSSProperties = useCustom && !hasBgVideo
    ? { background: `linear-gradient(135deg, ${colors!.bgFrom}, ${colors!.bgVia}, ${colors!.bgTo})` } : {};
  const textStyle: React.CSSProperties = useCustom ? { color: colors!.textColor } : {};
  const textClass = useCustom ? "" : theme.text;
  const cardBgStyle: React.CSSProperties = useCustom
    ? { background: colors!.cardBg, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" } : {};
  const cardBgClass = useCustom ? "rounded-2xl" : `${theme.cardBg} border border-white/20 rounded-2xl`;

  const fireConfetti = useCallback(() => {
    if (greeting.show_confetti) setTimeout(() => setConfettiActive(true), 300);
  }, [greeting.show_confetti]);

  const goToOpen = useCallback(() => { setPhase("open"); fireConfetti(); }, [fireConfetti]);

  const handleLoadComplete = useCallback(() => {
    if (hasMusic) setPhase("music");
    else if (interactiveMode) setPhase("hero");
    else goToOpen();
  }, [hasMusic, interactiveMode, goToOpen]);

  const handleMusicEnable = () => {
    setMusicEnabled(true); setAudioReady(true);
    if (interactiveMode) setPhase("hero"); else goToOpen();
  };
  const handleMusicSkip = () => {
    if (interactiveMode) setPhase("hero"); else goToOpen();
  };
  const handleYes = () => {
    goToOpen();
    setTimeout(() => revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
  };
  const handleReplay = () => {
    setPhase("loading"); setConfettiActive(false);
    setHearted(false); setMusicEnabled(false); setAudioReady(false);
    setReplayKey(k => k + 1);
  };
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: greeting.title, url });
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  const isOpen = phase === "open";

  return (
    <div key={replayKey} className="relative">
      <LoadingScreen key={`ls-${replayKey}`} recipientName={greeting.recipient_name}
        themeEmoji={theme.emoji} bgClass={bgClass} bgStyle={hasBgVideo ? {} : bgStyle} onComplete={handleLoadComplete} />
      <MusicPrompt show={phase === "music"} onEnable={handleMusicEnable} onSkip={handleMusicSkip} />

      {/* Overlays */}
      {isOpen && isChristmas && <SnowOverlay />}
      {isOpen && isNewYear && confettiActive && <FireworksOverlay />}
      {isOpen && !isNewYear && confettiActive && greeting.show_confetti && (
        <Confetti colors={useCustom ? [colors!.bgFrom, colors!.bgTo, "#ffffff"] : [theme.particle, "#ffffff"]} />
      )}

      {/* Zone 1 — Interactive Hero */}
      <AnimatePresence>
        {phase === "hero" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40">
            <InteractiveHero
              title={greeting.title} recipientName={greeting.recipient_name}
              themeEmoji={theme.emoji} theme={theme} colors={colors}
              ctaYesLabel={ctaYes} ctaNoLabel={ctaNo}
              noButtonBehavior={ex.no_button_behavior || "cycle"}
              noButtonLabels={ex.no_button_labels || []}
              onYes={handleYes}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone 2 — Full Card */}
      <div ref={revealRef} className={`min-h-screen relative overflow-hidden ${bgClass}`} style={hasBgVideo ? {} : bgStyle}>
        {hasBgVideo && <BackgroundVideo src={ex.uploaded_video_url} />}
        {!hasBgVideo && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {floaters.map(p => (
              <motion.div key={p.id} style={{ position: "absolute", fontSize: p.size, left: `${p.x}%`, top: "110%" }}
                animate={{ y: "-120vh", opacity: [0, 0.55, 0.55, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}>
                {theme.emoji}
              </motion.div>
            ))}
          </div>
        )}

        <motion.main variants={containerVariants} initial="hidden" animate={isOpen ? "visible" : "hidden"}
          className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-8 md:py-16 max-w-3xl mx-auto">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8 w-full">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl md:text-7xl mb-5">{theme.emoji}</motion.div>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg mb-3 ${textClass}`} style={textStyle}>
              {greeting.title}
            </h1>
            <p className={`text-base md:text-lg opacity-80 ${textClass}`} style={textStyle}>
              A special message for <span className="font-bold">{greeting.recipient_name}</span>
            </p>
          </motion.div>

          {/* Audio */}
          {hasMusic && musicEnabled && audioReady && (
            <motion.div variants={itemVariants} className="w-full mb-6">
              <AudioPlayer src={greeting.background_music_url!} autoPlay={musicEnabled} />
            </motion.div>
          )}

          {/* Birthday banner */}
          {greeting.theme === "birthday-fun" && (ageMilestone || true) && (
            <motion.div variants={itemVariants} className="w-full">
              <BirthdayBanner age={ageMilestone} name={greeting.recipient_name} textClass={textClass} textStyle={textStyle} />
            </motion.div>
          )}

          {/* Countdown timer */}
          {countdownDate && (
            <motion.div variants={itemVariants} className="w-full">
              <CountdownTimer targetDate={countdownDate} label={countdownLabel}
                textClass={textClass} textStyle={textStyle} cardBgClass={`p-5 mb-6 ${cardBgClass}`} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* Slideshow */}
          {greeting.image_urls?.length > 0 && (
            <motion.div variants={itemVariants} className="w-full mb-6">
              <Slideshow images={greeting.image_urls} />
            </motion.div>
          )}

          {/* Main message */}
          <motion.div variants={itemVariants} className={`w-full p-6 md:p-8 mb-6 shadow-2xl ${cardBgClass}`} style={cardBgStyle}>
            <div className="flex items-start gap-3 mb-4">
              <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                <Heart size={20} className={`fill-current opacity-70 ${textClass}`} style={textStyle} />
              </motion.div>
              <h2 className={`text-lg font-bold ${textClass}`} style={textStyle}>Dear {greeting.recipient_name},</h2>
            </div>
            <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${textClass}`} style={textStyle}>{greeting.message}</p>
            {pullQuote && <div className="mt-6"><PullQuote quote={pullQuote} textClass={textClass} textStyle={textStyle} /></div>}
            <div className="mt-6 pt-4 border-t border-white/20 text-right">
              <p className={`text-sm opacity-60 ${textClass}`} style={textStyle}>Forever yours,</p>
              <p className={`text-xl font-bold ${textClass}`} style={textStyle}>{greeting.sender_name}</p>
            </div>
          </motion.div>

          {/* Graduation badges */}
          {greeting.theme === "graduation-gold" && (badges.length > 0 || graduationYear) && (
            <motion.div variants={itemVariants} className="w-full">
              <GraduationBadges badges={badges} graduationYear={graduationYear} name={greeting.recipient_name}
                textClass={textClass} textStyle={textStyle} cardBgClass={cardBgClass} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* Animated Poem */}
          {poemLines.length > 0 && (
            <motion.div variants={itemVariants} className="w-full">
              <AnimatedPoem title={poemTitle} lines={poemLines}
                textClass={textClass} textStyle={textStyle} cardBgClass={`${cardBgClass}`} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* Reasons list */}
          {reasons.length > 0 && (
            <motion.div variants={itemVariants} className="w-full">
              <ReasonsList title={reasonsTitle} reasons={reasons}
                textClass={textClass} textStyle={textStyle} cardBgClass={`p-4 ${cardBgClass}`} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* Memory timeline */}
          {memories.length > 0 && (
            <motion.div variants={itemVariants} className="w-full">
              <MemoryTimeline title={memoriesTitle} memories={memories}
                textClass={textClass} textStyle={textStyle} cardBgClass={`p-4 ${cardBgClass}`} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* New Year review */}
          {greeting.theme === "new-year-glow" && yearReview.length > 0 && (
            <motion.div variants={itemVariants} className={`w-full p-5 mb-6 ${cardBgClass}`} style={cardBgStyle}>
              <p className={`text-xs uppercase tracking-widest opacity-50 mb-3 text-center ${textClass}`} style={textStyle}>Year in Review ✨</p>
              <div className="space-y-2">
                {yearReview.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 text-sm ${textClass}`} style={textStyle}>
                    <span className="text-base">⭐</span>{item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Inline video */}
          {!hasBgVideo && ex.uploaded_video_url && (
            <motion.div variants={itemVariants} className="w-full mb-6">
              <VideoPlayer src={ex.uploaded_video_url} />
            </motion.div>
          )}

          {/* YouTube embed */}
          {greeting.video_url && (
            <motion.div variants={itemVariants} className="w-full mb-6">
              <VideoEmbed url={greeting.video_url} />
            </motion.div>
          )}

          {/* Emoji reactions */}
          {enableReactions && (
            <motion.div variants={itemVariants} className="w-full">
              <EmojiReactions greetingId={greeting.id} textClass={textClass} textStyle={textStyle} />
            </motion.div>
          )}

          {/* Wishes wall */}
          {enableWishesWall && (
            <motion.div variants={itemVariants} className="w-full">
              <WishesWall greetingId={greeting.id} title={wishesTitle}
                textClass={textClass} textStyle={textStyle} cardBgClass={`p-4 ${cardBgClass}`} cardBgStyle={cardBgStyle} />
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full mt-2">
            <motion.button whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }} onClick={() => setHearted(!hearted)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all ${hearted ? "bg-red-500/40 border-red-400/60" : ""} ${textClass}`}
              style={textStyle}>
              <motion.div animate={hearted ? { scale: [1, 1.5, 1] } : {}}>
                <Heart size={18} className={hearted ? "fill-red-300 text-red-300" : ""} />
              </motion.div>
              {hearted ? `💕 ${ctaYes}!` : ctaYes}
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }} onClick={handleShare}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/20 backdrop-blur-sm border border-white/30 transition-all ${textClass}`}
              style={textStyle}>
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              {copied ? "Copied! 🎉" : ctaNo}
            </motion.button>
          </motion.div>

          {/* Replay + footer */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-4">
            <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={handleReplay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 border border-white/20 backdrop-blur-sm transition-all ${textClass}`}
              style={textStyle}>
              <RefreshCw size={14} /> Experience Again
            </motion.button>
            <p className={`text-xs opacity-30 ${textClass}`} style={textStyle}>
              Made with ❤️ by <a href="/" className="hover:opacity-60 underline underline-offset-2">Wish With Me</a>
            </p>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
