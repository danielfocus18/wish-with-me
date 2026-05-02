import { supabase } from "./supabase";
import { Greeting } from "@/types";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

export async function createGreeting(
  data: Omit<Greeting, "id" | "slug" | "created_at" | "updated_at">
): Promise<Greeting> {
  const baseSlug = slugify(data.title, { lower: true, strict: true });
  const uniqueSlug = `${baseSlug}-${uuidv4().slice(0, 6)}`;

  const { data: greeting, error } = await supabase
    .from("greetings")
    .insert([{ ...data, slug: uniqueSlug }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return greeting;
}

export async function updateGreeting(
  id: string,
  data: Partial<Greeting>
): Promise<Greeting> {
  const { data: greeting, error } = await supabase
    .from("greetings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return greeting;
}

export async function getGreetingBySlug(slug: string): Promise<Greeting | null> {
  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getAllGreetings(): Promise<Greeting[]> {
  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteGreeting(id: string): Promise<void> {
  const { error } = await supabase.from("greetings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadFile(
  bucket: string,
  file: File,
  folder = ""
): Promise<string> {
  const ext = file.name.split(".").pop();
  const filename = `${folder}${uuidv4()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}
