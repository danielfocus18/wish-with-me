"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PlusCircle, ExternalLink, Pencil, Trash2,
  Globe, EyeOff, Gift, TrendingUp
} from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { getAllGreetings, deleteGreeting } from "@/lib/greetings";
import { Greeting } from "@/types";
import { THEMES } from "@/lib/themes";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getAllGreetings();
      setGreetings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteGreeting(id);
      setGreetings((prev) => prev.filter((g) => g.id !== id));
    } catch (e: any) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const published = greetings.filter((g) => g.is_published);
  const drafts = greetings.filter((g) => !g.is_published);

  return (
    <AdminGuard>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your greeting cards
            </p>
          </div>
          <Link href="/admin/create">
            <Button icon={<PlusCircle size={16} />}>Create New Card</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Cards", value: greetings.length, icon: Gift, color: "violet" },
            { label: "Published", value: published.length, icon: Globe, color: "green" },
            { label: "Drafts", value: drafts.length, icon: EyeOff, color: "amber" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className={`inline-flex p-2 rounded-xl mb-3 bg-${color}-100`}>
                <Icon size={18} className={`text-${color}-600`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Cards List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : greetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold text-gray-700">No cards yet</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">Create your first greeting card to get started</p>
            <Link href="/admin/create">
              <Button icon={<PlusCircle size={16} />}>Create Your First Card</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {greetings.map((greeting, i) => {
              const theme = THEMES[greeting.theme];
              return (
                <motion.div
                  key={greeting.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Theme badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} shrink-0`}>
                    <span className="text-xl">{theme.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{greeting.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        greeting.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {greeting.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      For {greeting.recipient_name} · {theme.label} ·{" "}
                      {new Date(greeting.created_at).toLocaleDateString()}
                    </p>
                    {greeting.is_published && (
                      <p className="text-xs text-violet-600 font-mono mt-1 truncate">
                        /greetings/{greeting.slug}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {greeting.is_published && (
                      <a
                        href={`/greetings/${greeting.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="View card"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <Link href={`/admin/edit/${greeting.id}`}>
                      <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all">
                        <Pencil size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(greeting.id, greeting.title)}
                      disabled={deleting === greeting.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
