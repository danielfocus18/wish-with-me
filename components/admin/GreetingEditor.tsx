"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Eye, Link2, Sparkles } from "lucide-react";
import { Greeting, GreetingTheme } from "@/types";
import { createGreeting, updateGreeting, uploadFile } from "@/lib/greetings";
import ThemeSelector from "@/components/ui/ThemeSelector";
import FileUpload from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { THEMES } from "@/lib/themes";

type FormData = {
  title: string;
  recipient_name: string;
  message: string;
  theme: GreetingTheme;
  sender_name: string;
  image_urls: string[];
  background_music_url: string;
  video_url: string;
  background_video_url: string;
  show_confetti: boolean;
  is_published: boolean;
};

interface GreetingEditorProps {
  existing?: Greeting;
}

const defaultForm: FormData = {
  title: "",
  recipient_name: "",
  message: "",
  theme: "birthday-fun",
  sender_name: "",
  image_urls: [],
  background_music_url: "",
  video_url: "",
  background_video_url: "",
  show_confetti: true,
  is_published: false,
};

export default function GreetingEditor({ existing }: GreetingEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    existing
      ? {
          title: existing.title,
          recipient_name: existing.recipient_name,
          message: existing.message,
          theme: existing.theme,
          sender_name: existing.sender_name,
          image_urls: existing.image_urls,
          background_music_url: existing.background_music_url || "",
          video_url: existing.video_url || "",
          background_video_url: existing.background_video_url || "",
          show_confetti: existing.show_confetti,
          is_published: existing.is_published,
        }
      : defaultForm
  );

  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [savedSlug, setSavedSlug] = useState(existing?.slug || "");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (key: keyof FormData, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.recipient_name.trim()) e.recipient_name = "Recipient name is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (!form.sender_name.trim()) e.sender_name = "Sender name is required";
    setErrors(e as any);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const urls = await Promise.all(
        files.map((f) => uploadFile("greeting-images", f, "photos/"))
      );
      set("image_urls", [...form.image_urls, ...urls]);
    } catch (e: any) {
      alert("Image upload failed: " + e.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleMusicUpload = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingMusic(true);
    try {
      const url = await uploadFile("greeting-audio", files[0], "music/");
      set("background_music_url", url);
    } catch (e: any) {
      alert("Audio upload failed: " + e.message);
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        is_published: publish,
        background_music_url: form.background_music_url || null,
        video_url: form.video_url || null,
        background_video_url: form.background_video_url || null,
      };

      let greeting: Greeting;
      if (existing) {
        greeting = await updateGreeting(existing.id, payload);
      } else {
        greeting = await createGreeting(payload);
      }
      setSavedSlug(greeting.slug);

      if (publish) {
        router.push("/admin/dashboard");
      }
    } catch (e: any) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const theme = THEMES[form.theme];
  const cardUrl = savedSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/greetings/${savedSlug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Theme Preview Banner */}
      <motion.div
        key={form.theme}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-4 ${theme.bg} flex items-center gap-3`}
      >
        <span className="text-3xl">{theme.emoji}</span>
        <div>
          <p className="text-white font-bold text-sm drop-shadow-md">
            {theme.label} Theme Active
          </p>
          <p className="text-white/80 text-xs">
            {form.recipient_name
              ? `Preview: "Happy ${theme.label} to ${form.recipient_name}!"`
              : "Fill in the form below to build your card"}
          </p>
        </div>
      </motion.div>

      {/* Saved Link */}
      {cardUrl && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl"
        >
          <Link2 size={18} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-600 font-medium mb-0.5">Your card link:</p>
            <a
              href={cardUrl}
              target="_blank"
              className="text-sm text-green-800 font-mono break-all hover:underline"
            >
              {cardUrl}
            </a>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(cardUrl)}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 shrink-0"
          >
            Copy Link
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" />
              Card Details
            </h3>
            <Input
              label="Card Title *"
              placeholder="e.g. Happy Birthday Mom! 🎂"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              error={errors.title as string}
            />
            <Input
              label="Recipient's Name *"
              placeholder="e.g. Mom, Sarah, John"
              value={form.recipient_name}
              onChange={(e) => set("recipient_name", e.target.value)}
              error={errors.recipient_name as string}
            />
            <Input
              label="Your Name (Sender) *"
              placeholder="e.g. Your loving son Daniel"
              value={form.sender_name}
              onChange={(e) => set("sender_name", e.target.value)}
              error={errors.sender_name as string}
            />
            <Textarea
              label="Personal Message *"
              placeholder="Write your heartfelt message here..."
              rows={5}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              error={errors.message as string}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Media & Links</h3>
            <Input
              label="YouTube / Vimeo Video URL"
              placeholder="https://youtube.com/watch?v=..."
              value={form.video_url}
              onChange={(e) => set("video_url", e.target.value)}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="confetti"
                checked={form.show_confetti}
                onChange={(e) => set("show_confetti", e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
              <label htmlFor="confetti" className="text-sm text-gray-700">
                Enable confetti animation 🎉
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <ThemeSelector value={form.theme} onChange={(t) => set("theme", t)} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Uploads</h3>
            <FileUpload
              label="Photo Slideshow Images"
              accept="image/jpeg,image/png,image/webp,image/gif"
              fileType="image"
              multiple
              onFilesSelected={handleImageUpload}
              existingUrls={form.image_urls}
              onRemoveExisting={(url) =>
                set("image_urls", form.image_urls.filter((u) => u !== url))
              }
              uploading={uploadingImages}
            />
            <FileUpload
              label="Background Music (MP3)"
              accept="audio/mpeg,audio/mp3,audio/wav"
              fileType="audio"
              onFilesSelected={handleMusicUpload}
              uploading={uploadingMusic}
            />
            {form.background_music_url && (
              <div className="flex items-center gap-2 p-3 bg-violet-50 rounded-xl">
                <span className="text-xs text-violet-700 font-medium truncate flex-1">
                  🎵 Music uploaded
                </span>
                <button
                  onClick={() => set("background_music_url", "")}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-4 flex flex-col sm:flex-row gap-3 justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg">
        <Button
          variant="secondary"
          loading={saving}
          onClick={() => handleSave(false)}
          icon={<Save size={16} />}
        >
          Save Draft
        </Button>
        {savedSlug && (
          <Button
            variant="ghost"
            onClick={() => window.open(`/greetings/${savedSlug}`, "_blank")}
            icon={<Eye size={16} />}
            className="!text-gray-700 !border-gray-300 !bg-gray-50 hover:!bg-gray-100"
          >
            Preview
          </Button>
        )}
        <Button
          loading={saving}
          onClick={() => handleSave(true)}
          icon={<Link2 size={16} />}
        >
          Publish & Get Link
        </Button>
      </div>
    </div>
  );
}
