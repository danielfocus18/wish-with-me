import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Server-side upload route — used for memory timeline media
// Large audio/video files (background music, card videos) still use direct browser upload
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!bucket) return NextResponse.json({ error: "No bucket specified" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const filename = `${uuidv4()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(bytes);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, uint8, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });

  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
