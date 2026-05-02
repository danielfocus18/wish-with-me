import Link from "next/link";
import { Gift, Sparkles, Heart, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col items-center justify-center px-4 py-16 text-white text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Gift size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Wish With Me
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto leading-relaxed">
          Beautiful animated digital greeting cards for every milestone. 
          Birthdays, graduations, love, and everything in between.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-white/70">
          {["🎂 Birthdays", "❤️ Valentine's", "🎓 Graduations", "🌷 Mother's Day", "🎄 Christmas"].map(t => (
            <span key={t} className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20">{t}</span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/admin"
            className="px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 text-sm"
          >
            Admin Dashboard →
          </Link>
        </div>

        <p className="text-xs text-white/40 pt-8">
          Made with ❤️ by Wish With Me
        </p>
      </div>
    </main>
  );
}
