"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Music, Video } from "lucide-react";

type FileType = "image" | "audio" | "video";

interface FileUploadProps {
  label: string;
  accept: string;
  fileType: FileType;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
  uploading?: boolean;
}

const icons = { image: ImageIcon, audio: Music, video: Video };

export default function FileUpload({
  label,
  accept,
  fileType,
  multiple = false,
  onFilesSelected,
  existingUrls = [],
  onRemoveExisting,
  uploading,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [localPreviews, setLocalPreviews] = useState<{ name: string; url?: string }[]>([]);
  const Icon = icons[fileType];

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const arr = Array.from(files);
      onFilesSelected(arr);
      setLocalPreviews(
        arr.map((f) => ({
          name: f.name,
          url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        }))
      );
    },
    [onFilesSelected]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center
          transition-all duration-200 cursor-pointer
          ${dragging ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-400 bg-gray-50"}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          {uploading ? (
            <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <div className="p-3 bg-violet-100 rounded-full">
              <Icon size={22} className="text-violet-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {uploading ? "Uploading..." : "Drop files here or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{accept.replace(/,/g, ", ")}</p>
          </div>
        </div>
      </div>

      {/* Local preview thumbnails */}
      <AnimatePresence>
        {localPreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {localPreviews.map((p, i) => (
              <div key={i} className="relative">
                {p.url ? (
                  <img src={p.url} className="w-16 h-16 object-cover rounded-xl border border-gray-200" alt={p.name} />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-violet-100 rounded-xl border border-gray-200">
                    <Icon size={20} className="text-violet-500" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing uploaded URLs */}
      {existingUrls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {existingUrls.map((url) => (
            <div key={url} className="relative group">
              <img src={url} className="w-16 h-16 object-cover rounded-xl border border-gray-200" alt="uploaded" />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
