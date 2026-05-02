import { notFound } from "next/navigation";
import { THEMES } from "@/lib/themes";
import type { Metadata } from "next";
import GreetingCardClient from "./GreetingCardClient";
import { createClient } from "@supabase/supabase-js";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getGreeting(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const greeting = await getGreeting(slug);
  if (!greeting) return { title: "Card Not Found" };
  return {
    title: `${greeting.title} 💝`,
    description: `A special greeting for ${greeting.recipient_name} from ${greeting.sender_name}`,
    openGraph: {
      title: greeting.title,
      description: greeting.message.slice(0, 160),
      images: greeting.image_urls?.[0] ? [greeting.image_urls[0]] : [],
    },
  };
}

export default async function GreetingPage({ params }: Props) {
  const { slug } = await params;
  const greeting = await getGreeting(slug);
  if (!greeting) notFound();
  const theme = THEMES[greeting.theme as keyof typeof THEMES] ?? THEMES["general-love"];
  return <GreetingCardClient greeting={greeting} theme={theme} />;
}
