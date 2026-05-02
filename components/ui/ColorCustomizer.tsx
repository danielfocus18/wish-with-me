"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, RotateCcw } from "lucide-react";
import { ColorCustomization } from "@/types";

interface ColorCustomizerProps {
  value: ColorCustomization;
  onChange: (colors: ColorCustomization) => void;
}

const PRESET_COMBOS = [
  {
    label: "Sunset",
    bgFrom: "#f97316",
    bgTo: "#ec4899",
    bgVia: "#f43f5e",
    cardBg: "#ffffff22",
    textColor: "#ffffff",
  },
  {
    label: "Ocean",
    bgFrom: "#0ea5e9",
    bgTo: "#6366f1",
    bgVia: "#3b82f6",
    cardBg: "#ffffff15",
    textColor: "#ffffff",
  },
  {
    label: "Forest",
    bgFrom: "#16a34a",
    bgTo: "#065f46",
    bgVia: "#15803d",
    cardBg: "#ffffff20",
    textColor: "#ffffff",
  },
  {
    label: "Royal",
    bgFrom: "#7c3aed",
    bgTo: "#4f46e5",
    bgVia: "#6d28d9",
    cardBg: "#ffffff15",
    textColor: "#ffffff",
  },
  {
    label: "Rose Gold",
    bgFrom: "#fda4af",
    bgTo: "#f9a8d4",
    bgVia: "#fb7185",
    cardBg: "#ffffff30",
    textColor: "#4c0519",
  },
  {
    label: "Midnight",
    bgFrom: "#0f172a",
    bgTo: "#1e1b4b",
    bgVia: "#1e293b",
    cardBg: "#ffffff08",
    textColor: "#e2e8f0",
  },
  {
    label: "Gold Dust",
    bgFrom: "#92400e",
    bgTo: "#b45309",
    bgVia: "#d97706",
    cardBg: "#ffffff20",
    textColor: "#fef3c7",
  },
  {
    label: "Cotton Candy",
    bgFrom: "#e879f9",
    bgTo: "#a78bfa",
    bgVia: "#c084fc",
    cardBg: "#ffffff25",
    textColor: "#ffffff",
  },
];

export default function ColorCustomizer({ value, onChange }: ColorCustomizerProps) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof ColorCustomization, val: string | boolean) =>
    onChange({ ...value, [key]: val });

  const applyPreset = (preset: typeof PRESET_COMBOS[0]) => {
    onChange({
      ...value,
      bgFrom: preset.bgFrom,
      bgTo: preset.bgTo,
      bgVia: preset.bgVia,
      cardBg: preset.cardBg,
      textColor: preset.textColor,
      useCustomColors: true,
    });
  };

  const reset = () =>
    onChange({
      bgFrom: "#7c3aed",
      bgTo: "#4f46e5",
      bgVia: "#6d28d9",
      cardBg: "#ffffff15",
      textColor: "#ffffff",
      useCustomColors: false,
    });

  // Live preview gradient
  const previewStyle = value.useCustomColors
    ? {
        background: `linear-gradient(135deg, ${value.bgFrom}, ${value.bgVia}, ${value.bgTo})`,
      }
    : {};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-pink-50 rounded-xl">
            <Palette size={16} className="text-pink-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Custom Colors</p>
            <p className="text-xs text-gray-400">
              {value.useCustomColors ? "Custom colors active" : "Using theme colors"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {value.useCustomColors && (
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${value.bgFrom}, ${value.bgTo})`,
              }}
            />
          )}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
              {/* Enable toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Override theme colors
                </label>
                <button
                  type="button"
                  onClick={() => update("useCustomColors", !value.useCustomColors)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    value.useCustomColors ? "bg-violet-600" : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    animate={{ x: value.useCustomColors ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Live preview */}
              <div
                className="w-full h-16 rounded-xl transition-all duration-300 flex items-center justify-center"
                style={
                  value.useCustomColors
                    ? previewStyle
                    : { background: "linear-gradient(135deg, #7c3aed, #6d28d9, #4f46e5)" }
                }
              >
                <p
                  className="text-sm font-bold drop-shadow"
                  style={{ color: value.useCustomColors ? value.textColor : "#ffffff" }}
                >
                  Preview — Hello World! 🎉
                </p>
              </div>

              {/* Preset swatches */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Quick Presets</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COMBOS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      title={preset.label}
                      className="group relative h-10 rounded-xl border-2 border-transparent hover:border-violet-400 transition-all overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${preset.bgFrom}, ${preset.bgVia}, ${preset.bgTo})`,
                      }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <span className="text-white text-[10px] font-bold">{preset.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom color pickers */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-500">Fine-tune Colors</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Gradient Start", key: "bgFrom" as const },
                    { label: "Gradient Middle", key: "bgVia" as const },
                    { label: "Gradient End", key: "bgTo" as const },
                    { label: "Text Color", key: "textColor" as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className="relative">
                        <input
                          type="color"
                          value={value[key] as string}
                          onChange={(e) => {
                            update(key, e.target.value);
                            if (!value.useCustomColors) update("useCustomColors", true);
                          }}
                          className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 leading-tight">{label}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {(value[key] as string).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card background opacity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-gray-700">Card Background</p>
                    <p className="text-xs text-gray-400 font-mono">{value.cardBg}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Transparent</span>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={parseInt(value.cardBg.slice(-2), 16) || 0}
                      onChange={(e) => {
                        const hex = Math.round(Number(e.target.value))
                          .toString(16)
                          .padStart(2, "0");
                        update("cardBg", `#ffffff${hex}`);
                        if (!value.useCustomColors) update("useCustomColors", true);
                      }}
                      className="flex-1 accent-violet-600"
                    />
                    <span className="text-xs text-gray-400">Solid</span>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw size={12} />
                Reset to theme colors
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
