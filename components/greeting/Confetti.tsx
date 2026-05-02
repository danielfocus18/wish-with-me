"use client";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  colors?: string[];
}

export default function Confetti({ colors }: ConfettiProps) {
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const update = () =>
      setDims({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);

    // Stop after 8 seconds
    const timer = setTimeout(() => setActive(false), 8000);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, []);

  if (!active || dims.width === 0) return null;

  return (
    <ReactConfetti
      width={dims.width}
      height={dims.height}
      colors={colors || ["#a855f7", "#ec4899", "#f59e0b", "#22c55e", "#3b82f6"]}
      numberOfPieces={200}
      gravity={0.15}
      tweenDuration={5000}
      recycle={false}
      style={{ position: "fixed", top: 0, left: 0, zIndex: 100, pointerEvents: "none" }}
    />
  );
}
