"use client";
import { motion } from "framer-motion";
import { Award, GraduationCap, Star } from "lucide-react";

interface GraduationBlockProps {
  year: string;
  institution: string;
  badges: string[];
  futureGoal: string;
  recipientName: string;
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function GraduationBlock({ year, institution, badges, futureGoal, recipientName, textClass, textStyle, cardBgClass, cardBgStyle }: GraduationBlockProps) {
  return (
    <div className="w-full mb-6 space-y-4">
      {/* Diploma certificate */}
      {(year || institution) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-6 rounded-2xl text-center border-2 border-white/30 ${cardBgClass}`}
          style={cardBgStyle}
        >
          <GraduationCap size={36} className={`mx-auto mb-3 ${textClass}`} style={textStyle} />
          <p className={`text-xs uppercase tracking-widest opacity-60 mb-1 ${textClass}`} style={textStyle}>
            This certifies that
          </p>
          <p className={`text-2xl font-black mb-1 ${textClass}`} style={textStyle}>{recipientName}</p>
          <p className={`text-sm opacity-70 mb-2 ${textClass}`} style={textStyle}>
            has successfully completed their journey
          </p>
          {institution && (
            <p className={`font-bold ${textClass}`} style={textStyle}>{institution}</p>
          )}
          {year && (
            <p className={`text-lg font-black mt-1 ${textClass}`} style={textStyle}>Class of {year} 🎓</p>
          )}
          {/* Decorative stars */}
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, rotate: -30 }} whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Star size={14} className={`fill-current ${textClass}`} style={textStyle} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievement badges */}
      {badges?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-5 rounded-2xl ${cardBgClass}`}
          style={cardBgStyle}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className={textClass} style={textStyle} />
            <p className={`font-bold ${textClass}`} style={textStyle}>Achievements Unlocked</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 border border-white/30 rounded-full"
              >
                <span className="text-sm">🏆</span>
                <span className={`text-xs font-semibold ${textClass}`} style={textStyle}>{badge}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Future goal */}
      {futureGoal && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-5 rounded-2xl text-center ${cardBgClass}`}
          style={cardBgStyle}
        >
          <p className={`text-xs uppercase tracking-widest opacity-60 mb-2 ${textClass}`} style={textStyle}>
            Next Stop
          </p>
          <p className={`text-xl font-bold ${textClass}`} style={textStyle}>🚀 {futureGoal}</p>
        </motion.div>
      )}
    </div>
  );
}
