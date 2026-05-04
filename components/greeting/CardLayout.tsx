"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ThemeConfig, ColorCustomization } from "@/types";
import PullQuote from "./PullQuote";

interface CardLayoutProps {
  greeting: {
    title: string;
    recipient_name: string;
    message: string;
    sender_name: string;
    pull_quote?: string;
  };
  theme: ThemeConfig;
  colors: ColorCustomization | null;
  itemVariants: any;
}

export default function CardLayout({ greeting, theme, colors, itemVariants }: CardLayoutProps) {
  const useCustom = colors?.useCustomColors === true;
  const textStyle: React.CSSProperties = useCustom ? { color: colors!.textColor } : {};
  const textClass = useCustom ? "" : theme.text;
  const cardBgStyle: React.CSSProperties = useCustom
    ? { background: colors!.cardBg, backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)" }
    : { backdropFilter: "blur(16px)", border: theme.borderStyle };

  const fontStyle: React.CSSProperties = { fontFamily: theme.font };
  const headingStyle: React.CSSProperties = { ...fontStyle, ...textStyle };

  return (
    <>
      {/* ── Hero Title ── */}
      <motion.div variants={itemVariants} className="text-center mb-8 w-full">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl md:text-7xl mb-5 drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
        >
          {theme.emoji}
        </motion.div>

        {/* Decorative ornament line */}
        <div className="flex items-center justify-center gap-4 mb-5 opacity-50">
          <div className="h-px w-16 bg-current" style={textStyle} />
          <span style={{ ...textStyle, fontFamily: "serif", fontSize: "20px" }}>{theme.ornament}</span>
          <div className="h-px w-16 bg-current" style={textStyle} />
        </div>

        <h1
          className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg mb-3 ${textClass}`}
          style={headingStyle}
        >
          {greeting.title}
        </h1>

        <p className={`text-base md:text-lg opacity-75 ${textClass}`} style={textStyle}>
          For <span className="font-semibold">{greeting.recipient_name}</span>
        </p>
      </motion.div>

      {/* ── Message Card ── */}
      <motion.div
        variants={itemVariants}
        className={`w-full rounded-3xl mb-6 overflow-hidden shadow-2xl ${useCustom ? "" : theme.cardBg}`}
        style={cardBgStyle}
      >
        {/* Card header strip */}
        <div className="px-6 md:px-8 pt-6 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <Heart size={16} className={`fill-current opacity-70 ${textClass}`} style={textStyle} />
            </motion.div>
            <span
              className={`text-sm font-semibold tracking-wide ${textClass}`}
              style={{ ...textStyle, fontFamily: theme.font, opacity: 0.8 }}
            >
              A message for you
            </span>
          </div>
          <span className="text-lg opacity-40" style={textStyle}>{theme.ornament}</span>
        </div>

        {/* Salutation */}
        <div className="px-6 md:px-8 pt-5 pb-2">
          <p
            className={`text-xl md:text-2xl font-bold mb-4 ${textClass}`}
            style={{ ...textStyle, fontFamily: theme.font }}
          >
            Dear {greeting.recipient_name},
          </p>

          {/* Message */}
          <p className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${textClass}`} style={{ ...textStyle, lineHeight: "1.85" }}>
            {greeting.message}
          </p>

          {/* Pull quote */}
          {greeting.pull_quote && (
            <div className="mt-6">
              <PullQuote quote={greeting.pull_quote} textClass={textClass} textStyle={textStyle} />
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="px-6 md:px-8 pb-6 pt-4 border-t border-white/10 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-50">
              <div className="h-px w-8 bg-current" style={textStyle} />
              <span className="text-xs tracking-widest uppercase" style={textStyle}>with love</span>
              <div className="h-px w-8 bg-current" style={textStyle} />
            </div>
            <div className="text-right">
              <p
                className={`text-lg md:text-xl font-bold ${textClass}`}
                style={{ ...textStyle, fontFamily: theme.font }}
              >
                {greeting.sender_name}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
