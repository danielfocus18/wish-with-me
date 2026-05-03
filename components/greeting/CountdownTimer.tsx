"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  textClass: string;
  textStyle?: React.CSSProperties;
  cardBgClass: string;
  cardBgStyle?: React.CSSProperties;
}

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; past: boolean; }

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  const past = diff < 0;
  const abs = Math.abs(diff);
  return {
    days: Math.floor(abs / 86400000),
    hours: Math.floor((abs % 86400000) / 3600000),
    minutes: Math.floor((abs % 3600000) / 60000),
    seconds: Math.floor((abs % 60000) / 1000),
    past,
  };
}

export default function CountdownTimer({ targetDate, label, textClass, textStyle, cardBgClass, cardBgStyle }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft(targetDate));
    const t = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (!time) return null;

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} className={`w-full rounded-2xl p-5 mb-6 text-center ${cardBgClass}`} style={cardBgStyle}>
      <p className={`text-sm font-medium opacity-70 mb-4 ${textClass}`} style={textStyle}>
        {time.past ? "It's been..." : (label || "Counting down to the big day...")}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {units.map(u => (
          <div key={u.label} className="flex flex-col items-center">
            <motion.div
              key={u.value}
              initial={{ scale: 1.2, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl md:text-4xl font-black tabular-nums ${textClass}`}
              style={textStyle}
            >
              {String(u.value).padStart(2, "0")}
            </motion.div>
            <span className={`text-xs opacity-50 mt-1 ${textClass}`} style={textStyle}>{u.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
