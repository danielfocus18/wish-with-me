"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Play, Pause, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { MemoryEntry } from "@/types";
import { useRef } from "react";

interface MemoryTimelineProps {
  title: string;
  memories: MemoryEntry[];
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

function MemoryVideo({ src, textClass, textStyle }: { src: string; textClass: string; textStyle?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    playing ? ref.current.pause() : ref.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black group" style={{ aspectRatio: "16/9" }}>
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-contain"
        onEnded={() => setPlaying(false)}
        playsInline
      />
      {/* Play overlay */}
      <div
        onClick={toggle}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence>
          {!playing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
            >
              <Play size={18} className="text-gray-900 ml-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={toggle} className="text-white">
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => ref.current?.requestFullscreen()} className="text-white ml-auto">
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
}

function MemoryImage({ src }: { src: string }) {
  const [lightbox, setLightbox] = useState(false);
  return (
    <>
      <div
        className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
        style={{ aspectRatio: "16/9" }}
        onClick={() => setLightbox(true)}
      >
        <img src={src} alt="Memory" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="p-2 bg-white/80 rounded-full"
          >
            <Maximize2 size={14} className="text-gray-800" />
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={src}
              alt="Memory"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function MemoryTimeline({ title, memories, textClass, textStyle, cardBgClass, cardBgStyle }: MemoryTimelineProps) {
  if (!memories?.length) return null;

  return (
    <div className="w-full mb-6">
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-xl md:text-2xl font-bold text-center mb-6 ${textClass}`}
        style={textStyle}
      >
        {title || "Our Story 📅"}
      </motion.h2>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/20" />

        <div className="space-y-5">
          {memories.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex gap-4 pl-2"
            >
              {/* Timeline dot */}
              <div className="shrink-0 relative z-10 w-6 h-6 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Memory card */}
              <div className={`flex-1 rounded-2xl overflow-hidden ${cardBgClass}`} style={cardBgStyle}>
                {/* Media (image or video) */}
                {m.media_url && (
                  <div className="w-full">
                    {m.media_type === "video" ? (
                      <MemoryVideo src={m.media_url} textClass={textClass} textStyle={textStyle} />
                    ) : (
                      <MemoryImage src={m.media_url} />
                    )}
                  </div>
                )}

                {/* Text content */}
                <div className="p-4">
                  <div className={`flex items-center gap-1.5 text-xs opacity-60 mb-1 ${textClass}`} style={textStyle}>
                    <Calendar size={11} />
                    {m.date}
                  </div>
                  <p className={`font-bold text-sm mb-0.5 ${textClass}`} style={textStyle}>
                    {m.title}
                  </p>
                  {m.description && (
                    <p className={`text-xs opacity-75 leading-relaxed ${textClass}`} style={textStyle}>
                      {m.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
