import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Runs in Edge middleware on every public page view, so keep the answer per instance briefly.
const TTL_MS = 30_000;
let cached: { comingSoon: boolean; at: number } | null = null;

/** Whether the public website shows the coming-soon page. Fails closed (coming soon). */
export async function isComingSoon(): Promise<boolean> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.comingSoon;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=coming_soon&id=eq.true`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`site_settings ${res.status}`);
    const rows = (await res.json()) as { coming_soon: boolean }[];
    const comingSoon = rows[0]?.coming_soon ?? true;
    cached = { comingSoon, at: Date.now() };
    return comingSoon;
  } catch {
    return cached?.comingSoon ?? true;
  }
}
