import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    // Test 1: list buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    // Test 2: tiny upload to greeting-images
    const tiny = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const { error: uploadError } = await supabase.storage
      .from("greeting-images")
      .upload(`debug-test-${Date.now()}.png`, tiny, {
        contentType: "image/png",
        upsert: true,
      });

    return NextResponse.json({
      supabase_url: url?.slice(0, 40),
      key_starts_with: key?.slice(0, 30),
      buckets_found: buckets?.map(b => ({ name: b.name, public: b.public })) ?? [],
      bucket_list_error: bucketError?.message ?? null,
      test_upload_error: uploadError?.message ?? null,
      test_upload_success: !uploadError,
    });
  } catch (err: any) {
    return NextResponse.json({ fatal: err.message }, { status: 500 });
  }
}
