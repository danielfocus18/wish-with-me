import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("greeting_id");
  if (!id) return NextResponse.json({});
  const { data } = await db().from("greeting_reactions").select("emoji, count").eq("greeting_id", id);
  const counts: Record<string, number> = {};
  data?.forEach((r: any) => { counts[r.emoji] = r.count; });
  return NextResponse.json(counts);
}

export async function POST(req: NextRequest) {
  const { greeting_id, emoji, delta } = await req.json();
  if (!greeting_id || !emoji) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const supabase = db();
  const { data: existing } = await supabase.from("greeting_reactions").select("id, count").eq("greeting_id", greeting_id).eq("emoji", emoji).single();
  if (existing) {
    const newCount = Math.max(0, existing.count + (delta || 1));
    await supabase.from("greeting_reactions").update({ count: newCount }).eq("id", existing.id);
    return NextResponse.json({ count: newCount });
  }
  await supabase.from("greeting_reactions").insert([{ greeting_id, emoji, count: 1 }]);
  return NextResponse.json({ count: 1 });
}
