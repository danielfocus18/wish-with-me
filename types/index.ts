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

export interface GreetingExtras {
  pull_quote: string;
  cta_yes_label: string;
  cta_no_label: string;
  use_background_video: boolean;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface GreetingFeatures {
  // Universal
  reasons_title: string;
  reasons_list: string[];
  timeline_events: TimelineEvent[];
  countdown_date: string;
  countdown_label: string;
  poem_title: string;
  poem_lines: string[];
  enable_wishes_wall: boolean;
  enable_reactions: boolean;
  // Birthday
  birthday_age: number | null;
  // Graduation
  achievement_badges: string[];
  graduation_year: string;
  graduation_institution: string;
  future_goal: string;
  // Christmas / New Year
  show_snow: boolean;
  year_review_items: string[];
  new_year_wishes: string[];
}

export interface MemoryEntry {
  date: string;
  title: string;
  description: string;
}

export interface ReasonEntry {
  text: string;
}
