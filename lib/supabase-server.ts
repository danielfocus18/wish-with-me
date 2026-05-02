import { createClient } from "@supabase/supabase-js";

// Server-side client — used in Server Components and API routes
// Uses the same anon key but called from server, bypassing browser origin checks
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          // Tell Supabase this is a trusted server-side request
          "X-Client-Info": "wishwithme-server",
        },
      },
    }
  );
}
