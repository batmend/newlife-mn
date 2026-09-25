import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Middleware reads this on every public page view, so each Edge instance caches it briefly.
const TTL_MS = 30_000;
// After a failed read, retry sooner than the full TTL.
const ERROR_TTL_MS = 5_000;

let cached: { comingSoon: boolean; expires: number } | null = null;
let inflight: Promise<boolean> | null = null;

async function fetchComingSoon(): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=coming_soon&id=eq.true`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error(`site_settings ${res.status}`);
    const rows = (await res.json()) as { coming_soon: boolean }[];
    const comingSoon = rows[0]?.coming_soon !== false;
    cached = { comingSoon, expires: Date.now() + TTL_MS };
    return comingSoon;
  } catch {
    // Fail closed: if the setting can't be read, show the coming-soon page. Falling back
    // to a stale "published" value would reopen a site an admin may have just closed.
    cached = { comingSoon: true, expires: Date.now() + ERROR_TTL_MS };
    return true;
  }
}

export async function isComingSoon(): Promise<boolean> {
  if (cached && Date.now() < cached.expires) return cached.comingSoon;
  inflight ??= fetchComingSoon().finally(() => {
    inflight = null;
  });
  return inflight;
}
