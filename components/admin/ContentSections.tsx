"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, GripVertical } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { GreetingTheme } from "@/types";

interface ContentSectionsProps {
  theme: GreetingTheme;
  form: any;
  set: (key: string, val: any) => void;
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ListEditor({ items, onChange, placeholder, maxItems = 12 }: {
  items: string[]; onChange: (v: string[]) => void; placeholder: string; maxItems?: number;
}) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-300 shrink-0" />
          <input value={item} onChange={e => update(i, e.target.value)} placeholder={`${placeholder} ${i + 1}`}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <button type="button" onClick={() => remove(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {items.length < maxItems && (
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-medium py-1">
          <Plus size={13} /> Add item
        </button>
      )}
    </div>
  );
}

export default function ContentSections({ theme, form, set }: ContentSectionsProps) {
  const memories = form.memory_timeline || [];
  const updateMemory = (i: number, key: string, val: string) => {
    const next = [...memories]; next[i] = { ...next[i], [key]: val }; set("memory_timeline", next);
  };
  const addMemory = () => set("memory_timeline", [...memories, { date: "", title: "", description: "" }]);
  const removeMemory = (i: number) => set("memory_timeline", memories.filter((_: any, idx: number) => idx !== i));

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Content Sections</p>

      {/* Reasons list — all themes */}
      <Section title="Reasons / Dedication List" icon="💕">
        <Input label="Section Title" placeholder="Reasons Why I Love You"
          value={form.reasons_title || ""} onChange={e => set("reasons_title", e.target.value)} />
        <label className="block text-sm font-medium text-gray-700 mb-1">Items (up to 12)</label>
        <ListEditor items={form.reasons_list || []} onChange={v => set("reasons_list", v)}
          placeholder="Reason" maxItems={12} />
      </Section>

      {/* Memory timeline — all themes */}
      <Section title="Memory Timeline" icon="📅">
        <Input label="Section Title" placeholder="Our Story"
          value={form.memories_title || ""} onChange={e => set("memories_title", e.target.value)} />
        <div className="space-y-3">
          {memories.map((m: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2 relative">
              <button type="button" onClick={() => removeMemory(i)}
                className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500"><Trash2 size={13} /></button>
              <input placeholder="Date (e.g. June 2021)" value={m.date || ""} onChange={e => updateMemory(i, "date", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <input placeholder="Title (e.g. The day we met)" value={m.title || ""} onChange={e => updateMemory(i, "title", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <input placeholder="Description (optional)" value={m.description || ""} onChange={e => updateMemory(i, "description", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          ))}
          {memories.length < 10 && (
            <button type="button" onClick={addMemory}
              className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-medium py-1">
              <Plus size={13} /> Add memory
            </button>
          )}
        </div>
      </Section>

      {/* Countdown timer — all themes */}
      <Section title="Countdown Timer" icon="⏳">
        <Input label="Target Date & Time" type="datetime-local"
          value={form.countdown_date || ""} onChange={e => set("countdown_date", e.target.value)} />
        <Input label="Label (optional)" placeholder="Counting down to your birthday..."
          value={form.countdown_label || ""} onChange={e => set("countdown_label", e.target.value)} />
      </Section>

      {/* Animated poem — all themes */}
      <Section title="Animated Poem" icon="🎭">
        <Input label="Poem Title (optional)" placeholder="A Poem For You"
          value={form.poem_title || ""} onChange={e => set("poem_title", e.target.value)} />
        <p className="text-xs text-gray-500">Enter each line separately. Leave a line blank for a stanza break.</p>
        <ListEditor items={form.poem_lines || []} onChange={v => set("poem_lines", v)}
          placeholder="Line" maxItems={20} />
      </Section>

      {/* Wishes wall */}
      <Section title="Wishes Wall" icon="💌">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-700">Let viewers leave wishes</p>
          <button type="button" onClick={() => set("enable_wishes_wall", !form.enable_wishes_wall)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.enable_wishes_wall ? "bg-violet-600" : "bg-gray-200"}`}>
            <motion.div animate={{ x: form.enable_wishes_wall ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>
        {form.enable_wishes_wall && (
          <Input label="Wall Title" placeholder="Leave a Wish 💌"
            value={form.wishes_title || ""} onChange={e => set("wishes_title", e.target.value)} />
        )}
      </Section>

      {/* Emoji reactions */}
      <Section title="Emoji Reactions" icon="😍">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">Show reaction bar</p>
            <p className="text-xs text-gray-400">❤️ 🥺 😍 🎉 🥹 💕 — live counts</p>
          </div>
          <button type="button" onClick={() => set("enable_reactions", !form.enable_reactions)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.enable_reactions !== false ? "bg-violet-600" : "bg-gray-200"}`}>
            <motion.div animate={{ x: form.enable_reactions !== false ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>
      </Section>

      {/* Birthday-specific */}
      {theme === "birthday-fun" && (
        <Section title="Birthday — Age & Candles" icon="🎂">
          <Input label="Age (optional)" type="number" min={1} max={100} placeholder="e.g. 25"
            value={form.age_milestone || ""} onChange={e => set("age_milestone", e.target.value ? parseInt(e.target.value) : null)} />
          <p className="text-xs text-gray-400">Displays a big animated age number + interactive candles to blow out</p>
        </Section>
      )}

      {/* Graduation-specific */}
      {theme === "graduation-gold" && (
        <Section title="Graduation — Badges & Diploma" icon="🎓">
          <Input label="Graduation Year" placeholder="2025"
            value={form.graduation_year || ""} onChange={e => set("graduation_year", e.target.value)} />
          <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Badges</label>
          <ListEditor items={form.achievement_badges || []} onChange={v => set("achievement_badges", v)}
            placeholder="Achievement" maxItems={8} />
        </Section>
      )}

      {/* New Year-specific */}
      {theme === "new-year-glow" && (
        <Section title="Year in Review" icon="🎆">
          <p className="text-xs text-gray-500">Key highlights from the past year — shown as a star list</p>
          <ListEditor items={form.year_in_review || []} onChange={v => set("year_in_review", v)}
            placeholder="Highlight" maxItems={10} />
        </Section>
      )}
    </div>
  );
}
