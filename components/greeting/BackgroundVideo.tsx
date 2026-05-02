"use client";
import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  overlay?: boolean;
}

export default function BackgroundVideo({ src, overlay = true }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={ref}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}
    </div>
  );
}
