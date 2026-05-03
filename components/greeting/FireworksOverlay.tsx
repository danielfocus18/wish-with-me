"use client";
import { useEffect, useRef } from "react";

interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; size: number; }

const COLORS = ["#facc15","#a78bfa","#f472b6","#60a5fa","#34d399","#fb923c","#ffffff"];

export default function FireworksOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    let rafId: number;

    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60;
        const speed = 2 + Math.random() * 5;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
          alpha: 1, color, size: 1.5 + Math.random() * 2 });
      }
    };

    // Initial bursts
    setTimeout(() => burst(canvas.width * 0.3, canvas.height * 0.35), 100);
    setTimeout(() => burst(canvas.width * 0.7, canvas.height * 0.4), 500);
    setTimeout(() => burst(canvas.width * 0.5, canvas.height * 0.25), 1000);
    setTimeout(() => burst(canvas.width * 0.2, canvas.height * 0.5), 1500);
    setTimeout(() => burst(canvas.width * 0.8, canvas.height * 0.3), 2000);

    // Random bursts every 2.5s
    const interval = setInterval(() => {
      burst(Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            Math.random() * canvas.height * 0.5 + canvas.height * 0.1);
    }, 2500);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0.02);
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.08;
        p.alpha -= 0.015;
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafId); clearInterval(interval); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-20 pointer-events-none" />;
}
