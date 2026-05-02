"use client";
import { motion } from "framer-motion";

interface PullQuoteProps {
  quote: string;
  textClass: string;
  textStyle?: React.CSSProperties;
}

export default function PullQuote({ quote, textClass, textStyle }: PullQuoteProps) {
  if (!quote?.trim()) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-2 px-2"
    >
      <div className="relative border-l-4 border-white/40 pl-5 py-2">
        {/* Big decorative quote mark */}
        <span
          className={`absolute -top-4 -left-1 text-6xl font-serif leading-none opacity-20 ${textClass}`}
          style={textStyle}
          aria-hidden
        >
          "
        </span>
        <p
          className={`text-lg md:text-xl italic font-medium leading-relaxed ${textClass}`}
          style={textStyle}
        >
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
}
