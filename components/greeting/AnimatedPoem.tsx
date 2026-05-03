"use client";
import { motion } from "framer-motion";

interface AnimatedPoemProps {
  title: string;
  lines: string[];
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function AnimatedPoem({ title, lines, textClass, textStyle, cardBgClass, cardBgStyle }: AnimatedPoemProps) {
  if (!lines?.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`w-full rounded-3xl p-6 md:p-8 mb-6 text-center ${cardBgClass}`} style={cardBgStyle}>
      {title && (
        <p className={`text-xs uppercase tracking-widest opacity-50 mb-5 ${textClass}`} style={textStyle}>{title}</p>
      )}
      <div className="space-y-3">
        {lines.map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            className={`text-base md:text-lg italic leading-relaxed ${textClass} ${!line.trim() ? "h-3" : ""}`}
            style={textStyle}
          >
            {line || "\u00A0"}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
