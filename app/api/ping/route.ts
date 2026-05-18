import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Keep-alive endpoint — prevents Supabase free tier from pausing due to inactivity
// Pinged every 3 days by cron-job.org
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    // Lightweight read — just counts published cards, minimal DB load
    const { count, error } = await supabase
      .from("greetings")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    if (error) throw error;

    return NextResponse.json({
      status: "alive",
      timestamp: new Date().toISOString(),
      published_cards: count ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
