"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface ReasonsListProps {
  title: string;
  reasons: string[];
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function ReasonsList({ title, reasons, textClass, textStyle, cardBgClass, cardBgStyle }: ReasonsListProps) {
  if (!reasons?.length) return null;
  return (
    <div className="w-full mb-6">
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-xl md:text-2xl font-bold text-center mb-5 ${textClass}`} style={textStyle}>
        {title || "Reasons Why 💕"}
      </motion.h2>
      <div className="space-y-3">
        {reasons.map((reason, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
            className={`flex items-center gap-4 rounded-2xl p-4 ${cardBgClass}`} style={cardBgStyle}
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm" style={textStyle}>
              {i + 1}
            </div>
            <p className={`flex-1 text-sm md:text-base leading-relaxed ${textClass}`} style={textStyle}>{reason}</p>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} className="shrink-0">
              <Heart size={14} className={`fill-current opacity-50 ${textClass}`} style={textStyle} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
