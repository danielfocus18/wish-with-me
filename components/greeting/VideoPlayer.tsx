"use client";
import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { motion } from "framer-motion";

type FitMode = "contain" | "cover";

export default function VideoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    playing ? ref.current.pause() : ref.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!ref.current) return;
    setProgress(ref.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ref.current) return;
    ref.current.currentTime = Number(e.target.value);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl group">
      {/* Adaptive video container */}
      <div className="relative w-full bg-black" style={{ minHeight: "200px", maxHeight: "500px", height: "56vw" }}>
        <video
          ref={ref}
          src={src}
          className="absolute inset-0 w-full h-full transition-all duration-300"
          style={{ objectFit: fitMode, objectPosition: "center" }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(ref.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
          playsInline
          muted={muted}
        />

        {/* Centre play overlay */}
        <div
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <AnimatedPlayBtn playing={playing} />
        </div>

        {/* Fit mode toggle — top left */}
        <button
          onClick={() => setFitMode(f => f === "contain" ? "cover" : "contain")}
          title={fitMode === "contain" ? "Fill frame" : "Fit video"}
          className="absolute top-3 left-3 p-1.5 bg-black/50 hover:bg-black/80 rounded-lg text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          {fitMode === "contain" ? <Maximize size={14} /> : <Minimize size={14} />}
        </button>

        {/* Fullscreen — top right */}
        <button
          onClick={() => ref.current?.requestFullscreen()}
          className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/80 rounded-lg text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <Maximize size={14} />
        </button>
      </div>

      {/* Controls bar */}
      <div className="bg-black/80 px-4 py-2.5 flex items-center gap-3">
        <button onClick={toggle} className="text-white shrink-0">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <span className="text-white/50 text-xs font-mono shrink-0 w-20">
          {fmt(progress)} / {duration ? fmt(duration) : "--:--"}
        </span>

        <input
          type="range" min={0} max={duration || 100} value={progress}
          onChange={handleSeek}
          className="flex-1 h-1 accent-white rounded-full cursor-pointer"
        />

        <button
          onClick={() => { setMuted(!muted); if (ref.current) ref.current.muted = !muted; }}
          className="text-white/70 hover:text-white shrink-0"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function AnimatedPlayBtn({ playing }: { playing: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.8 : 1 }}
      whileHover={{ scale: 1.1 }}
      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl pointer-events-none"
    >
      <Play size={26} className="text-gray-900 ml-1" />
    </motion.div>
  );
}
