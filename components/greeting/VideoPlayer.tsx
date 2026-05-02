"use client";
import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    playing ? ref.current.pause() : ref.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl group aspect-video">
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover"
        onEnded={() => setPlaying(false)}
        playsInline
        muted={muted}
      />
      {/* Controls overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
        >
          {playing
            ? <Pause size={22} className="text-gray-900" />
            : <Play size={22} className="text-gray-900 ml-1" />}
        </motion.button>
      </div>
      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={toggle} className="text-white">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => { setMuted(!muted); if (ref.current) ref.current.muted = !muted; }} className="text-white">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button onClick={() => ref.current?.requestFullscreen()} className="text-white">
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
