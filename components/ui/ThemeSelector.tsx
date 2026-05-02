"use client";
import { THEMES } from "@/lib/themes";
import { GreetingTheme } from "@/types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  value: GreetingTheme;
  onChange: (theme: GreetingTheme) => void;
}

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Theme
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {(Object.entries(THEMES) as [GreetingTheme, typeof THEMES[GreetingTheme]][]).map(
          ([key, theme]) => (
            <motion.button
              key={key}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(key)}
              className={`
                relative rounded-2xl overflow-hidden h-20 cursor-pointer
                border-2 transition-all duration-200
                ${value === key ? "border-violet-600 shadow-lg shadow-violet-500/30 scale-105" : "border-transparent hover:border-gray-300"}
              `}
            >
              <div className={`absolute inset-0 ${theme.bg}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl">{theme.emoji}</span>
                <span className="text-xs font-semibold text-white drop-shadow-lg px-1 text-center leading-tight">
                  {theme.label}
                </span>
              </div>
              {value === key && (
                <div className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5">
                  <Check size={12} className="text-violet-600" />
                </div>
              )}
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}
