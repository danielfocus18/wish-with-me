import { Greeting } from "@/types";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

// All calls go to our own Next.js API routes (server-side)
// → completely bypasses Supabase browser origin restrictions

export async function createGreeting(
  data: Omit<Greeting, "id" | "slug" | "created_at" | "updated_at">
): Promise<Greeting> {
  const baseSlug = slugify(data.title, { lower: true, strict: true });
  const uniqueSlug = `${baseSlug}-${uuidv4().slice(0, 6)}`;

  const res = await fetch("/api/greetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, slug: uniqueSlug }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create greeting");
  }
  return res.json();
}

export async function updateGreeting(
  id: string,
  data: Partial<Greeting>
): Promise<Greeting> {
  const res = await fetch(`/api/greetings?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update greeting");
  }
  return res.json();
}

export async function getGreetingBySlug(slug: string): Promise<Greeting | null> {
  const res = await fetch(`/api/greetings?slug=${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getAllGreetings(): Promise<Greeting[]> {
  const res = await fetch("/api/greetings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch greetings");
  return res.json();
}

export async function deleteGreeting(id: string): Promise<void> {
  const res = await fetch(`/api/greetings?id=${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete greeting");
  }
}

export async function uploadFile(
  bucket: string,
  file: File,
  folder = ""
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  // Safely parse — server might return plain text on crash
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Upload server error (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) throw new Error(data.error || "Upload failed");
  if (!data.url) throw new Error("No URL returned from upload");
  return data.url;
}
