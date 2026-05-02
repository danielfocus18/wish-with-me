"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

interface MusicPromptProps {
  show: boolean;
  onEnable: () => void;
  onSkip: () => void;
}

export default function MusicPrompt({ show, onEnable, onSkip }: MusicPromptProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Music size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">This card has music 🎵</p>
                <p className="text-white/60 text-xs">Would you like to play it?</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onEnable}
                className="flex-1 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors"
              >
                🎶 Play Music
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onSkip}
                className="px-4 py-2.5 bg-white/10 text-white/70 text-sm rounded-xl hover:bg-white/20 transition-colors flex items-center gap-1.5"
              >
                <VolumeX size={14} />
                Skip
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
