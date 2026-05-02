"use client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Direct browser → Supabase Storage upload
// Bypasses Vercel's 4.5MB serverless limit entirely
// Works because we set public storage policies in Supabase

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function uploadFileDirect(
  bucket: string,
  file: File,
  folder = ""
): Promise<string> {
  const supabase = getClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${folder}${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}
