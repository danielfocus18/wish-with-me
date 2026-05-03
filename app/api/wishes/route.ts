import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("greeting_id");
  if (!id) return NextResponse.json([]);
  const { data, error } = await db().from("greeting_wishes").select("*").eq("greeting_id", id).order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { greeting_id, name, message } = body;
  if (!greeting_id || !name?.trim() || !message?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const { data, error } = await db().from("greeting_wishes").insert([{ greeting_id, name: name.slice(0, 40), message: message.slice(0, 200) }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
