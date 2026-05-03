"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Eye, Link2, Sparkles, Quote, Tv2 } from "lucide-react";
import { Greeting, GreetingTheme, ColorCustomization } from "@/types";
import { createGreeting, updateGreeting, uploadFile } from "@/lib/greetings";
import ThemeSelector from "@/components/ui/ThemeSelector";
import FileUpload from "@/components/ui/FileUpload";
import ColorCustomizer from "@/components/ui/ColorCustomizer";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { THEMES, THEME_INTERACTIVE_DEFAULTS } from "@/lib/themes";

const DEFAULT_COLORS: ColorCustomization = {
  bgFrom: "#7c3aed", bgTo: "#4f46e5", bgVia: "#6d28d9",
  cardBg: "#ffffff15", textColor: "#ffffff", useCustomColors: false,
};

type FormData = {
  title: string; recipient_name: string; message: string;
  theme: GreetingTheme; sender_name: string; image_urls: string[];
  background_music_url: string; video_url: string;
  uploaded_video_url: string; use_background_video: boolean;
  show_confetti: boolean; is_published: boolean;
  color_customization: ColorCustomization;
  pull_quote: string; cta_yes_label: string; cta_no_label: string;
  interactive_mode: boolean;
  no_button_behavior: "cycle" | "runaway" | "shrink" | "countdown";
  no_button_labels: string;
};

const defaultForm: FormData = {
  title: "", recipient_name: "", message: "", theme: "birthday-fun",
  sender_name: "", image_urls: [], background_music_url: "", video_url: "",
  uploaded_video_url: "", use_background_video: false, show_confetti: true,
  is_published: false, color_customization: DEFAULT_COLORS,
  pull_quote: "", cta_yes_label: "Send Love", cta_no_label: "Share This Card",
  interactive_mode: false, no_button_behavior: "cycle",
  no_button_labels: "Maybe Later,Are you sure? 🥺,Really though...,Last chance! 💔,Ok fine... 😢",
};

export default function GreetingEditor({ existing }: { existing?: Greeting }) {
  const router = useRouter();
  const ex = existing as any;
  const [form, setForm] = useState<FormData>(existing ? {
    title: existing.title, recipient_name: existing.recipient_name,
    message: existing.message, theme: existing.theme,
    sender_name: existing.sender_name, image_urls: existing.image_urls,
    background_music_url: existing.background_music_url || "",
    video_url: existing.video_url || "",
    uploaded_video_url: ex?.uploaded_video_url || "",
    use_background_video: ex?.use_background_video || false,
    show_confetti: existing.show_confetti, is_published: existing.is_published,
    color_customization: ex?.color_customization || DEFAULT_COLORS,
    pull_quote: ex?.pull_quote || "",
    cta_yes_label: ex?.cta_yes_label || "Send Love",
    cta_no_label: ex?.cta_no_label || "Share This Card",
    interactive_mode: ex?.interactive_mode || false,
    no_button_behavior: ex?.no_button_behavior || "cycle",
    no_button_labels: (ex?.no_button_labels || []).join(",") || "Maybe Later,Are you sure? 🥺,Really though...,Last chance! 💔,Ok fine... 😢",
  } : defaultForm);

  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [savedSlug, setSavedSlug] = useState(existing?.slug || "");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (key: keyof FormData, val: any) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.recipient_name.trim()) e.recipient_name = "Recipient name is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (!form.sender_name.trim()) e.sender_name = "Sender name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const urls = await Promise.all(files.map(f => uploadFile("greeting-images", f, "photos/")));
      set("image_urls", [...form.image_urls, ...urls]);
    } catch (e: any) { alert("Image upload failed: " + e.message); }
    finally { setUploadingImages(false); }
  };

  const handleMusicUpload = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingMusic(true);
    try { set("background_music_url", await uploadFile("greeting-audio", files[0], "music/")); }
    catch (e: any) { alert("Audio upload failed: " + e.message); }
    finally { setUploadingMusic(false); }
  };

  const handleVideoUpload = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingVideo(true);
    try { set("uploaded_video_url", await uploadFile("greeting-videos", files[0], "videos/")); }
    catch (e: any) { alert("Video upload failed: " + e.message); }
    finally { setUploadingVideo(false); }
  };

  const handleSave = async (publish: boolean) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form, is_published: publish,
        background_music_url: form.background_music_url || null,
        video_url: form.video_url || null,
        background_video_url: null,
        uploaded_video_url: form.uploaded_video_url || null,
        interactive_mode: form.interactive_mode,
        no_button_behavior: form.no_button_behavior,
        no_button_labels: form.no_button_labels
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };
      const greeting = existing
        ? await updateGreeting(existing.id, payload)
        : await createGreeting(payload);
      setSavedSlug(greeting.slug);
      if (publish) router.push("/admin/dashboard");
    } catch (e: any) { alert("Error saving: " + e.message); }
    finally { setSaving(false); }
  };

  const theme = THEMES[form.theme];
  const colors = form.color_customization;
  const previewStyle = colors.useCustomColors
    ? { background: `linear-gradient(135deg, ${colors.bgFrom}, ${colors.bgVia}, ${colors.bgTo})` }
    : {};
  const cardUrl = savedSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/greetings/${savedSlug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        key={form.theme + colors.bgFrom + String(colors.useCustomColors)}
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-4 flex items-center gap-3 ${!colors.useCustomColors ? theme.bg : ""}`}
        style={colors.useCustomColors ? previewStyle : {}}
      >
        <span className="text-3xl">{theme.emoji}</span>
        <div>
          <p className="text-white font-bold text-sm drop-shadow-md">
            {colors.useCustomColors ? "Custom Colors Active 🎨" : `${theme.label} Theme`}
          </p>
          <p className="text-white/80 text-xs">
            {form.recipient_name ? `For ${form.recipient_name} · from ${form.sender_name || "you"}` : "Fill in the form below"}
          </p>
        </div>
      </motion.div>

      {/* Saved link */}
      {cardUrl && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <Link2 size={18} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-600 font-medium mb-0.5">Your card link:</p>
            <a href={cardUrl} target="_blank" className="text-sm text-green-800 font-mono break-all hover:underline">{cardUrl}</a>
          </div>
          <button onClick={() => navigator.clipboard.writeText(cardUrl!)}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 shrink-0">
            Copy Link
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          {/* Card details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" /> Card Details
            </h3>
            <Input label="Card Title *" placeholder="e.g. Happy Birthday Mom! 🎂"
              value={form.title} onChange={e => set("title", e.target.value)} error={errors.title} />
            <Input label="Recipient's Name *" placeholder="e.g. Mom, Sarah, John"
              value={form.recipient_name} onChange={e => set("recipient_name", e.target.value)} error={errors.recipient_name} />
            <Input label="Your Name (Sender) *" placeholder="e.g. Your loving son Daniel"
              value={form.sender_name} onChange={e => set("sender_name", e.target.value)} error={errors.sender_name} />
            <Textarea label="Personal Message *" placeholder="Write your heartfelt message here..."
              rows={5} value={form.message} onChange={e => set("message", e.target.value)} error={errors.message} />
          </div>

          {/* Pull quote + CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Quote size={16} className="text-pink-500" /> Quote & Buttons
            </h3>
            <Textarea
              label='Pull Quote (shown as styled callout below message)'
              placeholder='"Even the smallest moments with you become treasures..."'
              rows={2}
              value={form.pull_quote}
              onChange={e => set("pull_quote", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="❤️ Button 1 Label" placeholder="Send Love"
                value={form.cta_yes_label} onChange={e => set("cta_yes_label", e.target.value)} />
              <Input label="🔗 Button 2 Label" placeholder="Share This Card"
                value={form.cta_no_label} onChange={e => set("cta_no_label", e.target.value)} />
            </div>
            <p className="text-xs text-gray-400">Tip: Try "Yes, Forever!" and "Maybe Later" for romantic cards 💕</p>

            {/* Interactive Mode */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">✨ Interactive Mode</p>
                  <p className="text-xs text-gray-400">Show a full-screen hero with Yes/No buttons before the card reveals</p>
                </div>
                <button type="button" onClick={() => set("interactive_mode", !form.interactive_mode)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.interactive_mode ? "bg-violet-600" : "bg-gray-200"}`}>
                  <motion.div animate={{ x: form.interactive_mode ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

              {form.interactive_mode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      "No" Button Behavior
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["cycle","runaway","shrink","countdown"] as const).map(b => (
                        <button key={b} type="button"
                          onClick={() => set("no_button_behavior", b)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                            form.no_button_behavior === b
                              ? "bg-violet-600 text-white border-violet-600"
                              : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                          }`}>
                          {b === "cycle" && "🔄 Cycle Labels"}
                          {b === "runaway" && "🏃 Run Away"}
                          {b === "shrink" && "📉 Shrink"}
                          {b === "countdown" && "⏳ Countdown"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    label="Cycle Labels (comma-separated, in order)"
                    placeholder="Maybe Later,Are you sure? 🥺,Really though...,Last chance! 💔"
                    rows={2}
                    value={form.no_button_labels}
                    onChange={e => set("no_button_labels", e.target.value)}
                  />
                  <p className="text-xs text-gray-400">The last label stays shown when all cycles are done.</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Video */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Tv2 size={16} className="text-blue-500" /> Video
            </h3>
            <FileUpload
              label="Upload Video (MP4 / WebM / MOV)"
              accept="video/mp4,video/webm,video/quicktime"
              fileType="video"
              onFilesSelected={handleVideoUpload}
              uploading={uploadingVideo}
            />
            {form.uploaded_video_url && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                  <span className="text-xs text-blue-700 font-medium truncate flex-1">🎬 Video uploaded</span>
                  <a href={form.uploaded_video_url} target="_blank" className="text-xs text-blue-600 hover:underline">Preview</a>
                  <button onClick={() => { set("uploaded_video_url", ""); set("use_background_video", false); }}
                    className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                {/* Background video toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Use as background video</p>
                    <p className="text-xs text-gray-400">Plays silently behind the card (no player UI)</p>
                  </div>
                  <button type="button" onClick={() => set("use_background_video", !form.use_background_video)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.use_background_video ? "bg-violet-600" : "bg-gray-200"}`}>
                    <motion.div
                      animate={{ x: form.use_background_video ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <Input label="YouTube / Vimeo URL" placeholder="https://youtube.com/watch?v=..."
              value={form.video_url} onChange={e => set("video_url", e.target.value)} />

            <div className="flex items-center gap-3">
              <input type="checkbox" id="confetti" checked={form.show_confetti}
                onChange={e => set("show_confetti", e.target.checked)} className="w-4 h-4 accent-violet-600" />
              <label htmlFor="confetti" className="text-sm text-gray-700">Enable confetti animation 🎉</label>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <ThemeSelector value={form.theme} onChange={t => {
              set("theme", t);
              // Auto-apply per-theme interactive defaults (only if not yet customised)
              const defaults = THEME_INTERACTIVE_DEFAULTS[t];
              if (defaults && !form.interactive_mode) {
                setForm(prev => ({
                  ...prev,
                  theme: t,
                  interactive_mode: defaults.interactive_mode,
                  no_button_behavior: defaults.no_button_behavior,
                  no_button_labels: defaults.no_button_labels.join(","),
                  cta_yes_label: prev.cta_yes_label === "Send Love" ? defaults.cta_yes_label : prev.cta_yes_label,
                  cta_no_label: prev.cta_no_label === "Share This Card" ? defaults.cta_no_label : prev.cta_no_label,
                }));
              } else {
                set("theme", t);
              }
            }} />
          </div>
          <ColorCustomizer value={form.color_customization} onChange={c => set("color_customization", c)} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Photos & Audio</h3>
            <FileUpload label="Photo Slideshow Images"
              accept="image/jpeg,image/png,image/webp,image/gif"
              fileType="image" multiple
              onFilesSelected={handleImageUpload}
              existingUrls={form.image_urls}
              onRemoveExisting={url => set("image_urls", form.image_urls.filter(u => u !== url))}
              uploading={uploadingImages} />
            <FileUpload label="Background Music (MP3)"
              accept="audio/mpeg,audio/mp3,audio/wav"
              fileType="audio"
              onFilesSelected={handleMusicUpload}
              uploading={uploadingMusic} />
            {form.background_music_url && (
              <div className="flex items-center gap-2 p-3 bg-violet-50 rounded-xl">
                <span className="text-xs text-violet-700 font-medium truncate flex-1">🎵 Music uploaded</span>
                <button onClick={() => set("background_music_url", "")} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky bottom-4 flex flex-col sm:flex-row gap-3 justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg">
        <Button variant="secondary" loading={saving} onClick={() => handleSave(false)} icon={<Save size={16} />}>Save Draft</Button>
        {savedSlug && (
          <Button variant="ghost" onClick={() => window.open(`/greetings/${savedSlug}`, "_blank")} icon={<Eye size={16} />}
            className="!text-gray-700 !border-gray-300 !bg-gray-50 hover:!bg-gray-100">Preview</Button>
        )}
        <Button loading={saving} onClick={() => handleSave(true)} icon={<Link2 size={16} />}>Publish & Get Link</Button>
      </div>
    </div>
  );
}
