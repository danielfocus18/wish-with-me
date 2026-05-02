import { NextResponse } from "next/server";

// Uploads now go directly from the browser to Supabase Storage
// (bypasses Vercel's 4.5MB serverless limit for large audio/video files)
// This route is kept as a placeholder but is no longer called.
export async function POST() {
  return NextResponse.json(
    { error: "Use direct Supabase storage upload instead" },
    { status: 410 }
  );
}
