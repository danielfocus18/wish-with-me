"use client";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { MemoryEntry } from "@/types";

interface MemoryTimelineProps {
  title: string;
  memories: MemoryEntry[];
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

export default function MemoryTimeline({ title, memories, textClass, textStyle, cardBgClass, cardBgStyle }: MemoryTimelineProps) {
  if (!memories?.length) return null;
  return (
    <div className="w-full mb-6">
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-xl md:text-2xl font-bold text-center mb-6 ${textClass}`} style={textStyle}>
        {title || "Our Story 📅"}
      </motion.h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/20" />
        <div className="space-y-5">
          {memories.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex gap-4 pl-2"
            >
              {/* Dot */}
              <div className="shrink-0 relative z-10 w-6 h-6 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              {/* Card */}
              <div className={`flex-1 rounded-2xl p-4 ${cardBgClass}`} style={cardBgStyle}>
                <div className={`flex items-center gap-1.5 text-xs opacity-60 mb-1 ${textClass}`} style={textStyle}>
                  <Calendar size={11} />
                  {m.date}
                </div>
                <p className={`font-bold text-sm mb-0.5 ${textClass}`} style={textStyle}>{m.title}</p>
                {m.description && (
                  <p className={`text-xs opacity-75 leading-relaxed ${textClass}`} style={textStyle}>{m.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
