export type GreetingTheme =
  | "birthday-fun"
  | "romantic-red"
  | "graduation-gold"
  | "mothers-day"
  | "fathers-day"
  | "christmas-joy"
  | "new-year-glow"
  | "general-love";

export interface Greeting {
  id: string;
  slug: string;
  title: string;
  recipient_name: string;
  message: string;
  theme: GreetingTheme;
  sender_name: string;
  image_urls: string[];
  background_music_url: string | null;
  video_url: string | null;
  background_video_url: string | null;
  uploaded_video_url: string | null;
  show_confetti: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  label: string;
  emoji: string;
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  font: string;
  gradientFrom: string;
  gradientTo: string;
  cardBg: string;
  particle: string;
}

export type ThemeMap = Record<GreetingTheme, ThemeConfig>;

export interface ColorCustomization {
  bgFrom: string;
  bgTo: string;
  bgVia: string;
  cardBg: string;
  textColor: string;
  useCustomColors: boolean;
}
