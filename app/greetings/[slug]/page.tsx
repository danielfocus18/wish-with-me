import { getGreetingBySlug } from "@/lib/greetings";
import { notFound } from "next/navigation";
import { THEMES } from "@/lib/themes";
import type { Metadata } from "next";
import GreetingCardClient from "./GreetingCardClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const greeting = await getGreetingBySlug(slug);
  if (!greeting) return { title: "Card Not Found" };
  return {
    title: `${greeting.title} 💝`,
    description: `A special greeting for ${greeting.recipient_name} from ${greeting.sender_name}`,
    openGraph: {
      title: greeting.title,
      description: greeting.message.slice(0, 160),
      images: greeting.image_urls[0] ? [greeting.image_urls[0]] : [],
    },
  };
}

export default async function GreetingPage({ params }: Props) {
  const { slug } = await params;
  const greeting = await getGreetingBySlug(slug);

  if (!greeting) notFound();

  const theme = THEMES[greeting.theme];

  return <GreetingCardClient greeting={greeting} theme={theme} />;
}
