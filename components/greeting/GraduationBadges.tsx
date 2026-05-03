"use client";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface GraduationBadgesProps {
  badges: string[];
  graduationYear?: string;
  name: string;
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function GraduationBadges({ badges, graduationYear, name, textClass, textStyle, cardBgClass, cardBgStyle }: GraduationBadgesProps) {
  if (!badges?.length && !graduationYear) return null;
  return (
    <div className="w-full mb-6">
      {/* Diploma-style header */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`rounded-2xl p-6 mb-4 text-center border-2 border-white/30 ${cardBgClass}`} style={cardBgStyle}>
        <p className={`text-xs uppercase tracking-widest opacity-50 mb-2 ${textClass}`} style={textStyle}>
          Certificate of Achievement
        </p>
        <p className={`text-2xl font-black mb-1 ${textClass}`} style={textStyle}>{name}</p>
        {graduationYear && (
          <p className={`text-sm opacity-70 ${textClass}`} style={textStyle}>Class of {graduationYear} 🎓</p>
        )}
      </motion.div>

      {/* Achievement badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.map((badge, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold ${cardBgClass} border border-white/30`}
              style={cardBgStyle}
            >
              <Award size={14} className={textClass} style={textStyle} />
              <span className={textClass} style={textStyle}>{badge}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
