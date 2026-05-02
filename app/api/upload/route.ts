import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const config = { api: { bodyParser: false } };

function json(data: object, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const folder = (formData.get("folder") as string) || "";

    if (!file) return json({ error: "No file provided" }, 400);
    if (!bucket) return json({ error: "No bucket specified" }, 400);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    // Read file as ArrayBuffer → Uint8Array (works for all file types)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const filename = `${folder}${uuidv4()}.${ext}`;

    // Determine correct MIME type
    const mimeType = file.type || getMimeType(ext);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, uint8Array, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return json({ error: uploadError.message }, 500);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return json({ url: data.publicUrl });

  } catch (err: any) {
    console.error("Upload route error:", err);
    return json({ error: err?.message || "Upload failed unexpectedly" }, 500);
  }
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    webm: "video/webm",
  };
  return map[ext] || "application/octet-stream";
}
