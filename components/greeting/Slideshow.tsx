"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

interface SlideshowProps {
  images: string[];
  autoPlayInterval?: number;
}

export default function Slideshow({ images, autoPlayInterval = 4500 }: SlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [images.length, autoPlayInterval]);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + images.length) % images.length);
  };

  if (!images.length) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      {/* Adaptive height container — tall enough for portrait, wide enough for landscape */}
      <div className="relative w-full" style={{ minHeight: "260px", maxHeight: "520px", height: "60vw" }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.img
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="absolute inset-0 w-full h-full transition-all duration-300"
            style={{ objectFit: fitMode, objectPosition: "center" }}
          />
        </AnimatePresence>

        {/* Subtle vignette — only in cover mode */}
        {fitMode === "cover" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}

        {/* Fit toggle button */}
        <button
          onClick={() => setFitMode(f => f === "contain" ? "cover" : "contain")}
          title={fitMode === "contain" ? "Switch to fill frame" : "Switch to fit image"}
          className="absolute top-3 left-3 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-all backdrop-blur-sm"
        >
          {fitMode === "contain" ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 text-xs text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Prev/Next */}
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-sm">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-sm">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dot strip below image — clean, not overlapping */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-2.5 bg-black/60">
          {images.map((_, i) => (
            <button key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
