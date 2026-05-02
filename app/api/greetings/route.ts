import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// All Supabase calls go through this server-side proxy
// → bypasses browser CORS/origin restrictions entirely
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// GET /api/greetings?slug=xxx  →  fetch single published greeting
// GET /api/greetings            →  fetch all greetings (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const supabase = getSupabase();

  if (slug) {
    const { data, error } = await supabase
      .from("greetings")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/greetings  →  create new greeting
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("greetings")
    .insert([body])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/greetings?id=xxx  →  update greeting
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("greetings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/greetings?id=xxx  →  delete greeting
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const supabase = getSupabase();
  const { error } = await supabase.from("greetings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
