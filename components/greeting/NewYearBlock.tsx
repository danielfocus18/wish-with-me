"use client";
import { motion } from "framer-motion";

interface NewYearBlockProps {
  reviewItems: string[];
  wishes: string[];
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function NewYearBlock({ reviewItems, wishes, textClass, textStyle, cardBgClass, cardBgStyle }: NewYearBlockProps) {
  if (!reviewItems?.length && !wishes?.length) return null;
  return (
    <div className="w-full mb-6 space-y-4">
      {reviewItems?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-5 rounded-2xl ${cardBgClass}`}
          style={cardBgStyle}
        >
          <p className={`font-bold text-center mb-4 ${textClass}`} style={textStyle}>
            ✨ Your Year in Review
          </p>
          <div className="space-y-2">
            {reviewItems.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg shrink-0">⭐</span>
                <p className={`text-sm leading-relaxed ${textClass}`} style={textStyle}>{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {wishes?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-5 rounded-2xl ${cardBgClass}`}
          style={cardBgStyle}
        >
          <p className={`font-bold text-center mb-4 ${textClass}`} style={textStyle}>
            🎆 Wishes for the New Year
          </p>
          <div className="space-y-2">
            {wishes.map((wish, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg shrink-0">🌟</span>
                <p className={`text-sm leading-relaxed ${textClass}`} style={textStyle}>{wish}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
