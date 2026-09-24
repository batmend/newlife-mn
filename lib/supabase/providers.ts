import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  SUPPORTED_OAUTH_PROVIDERS,
  type OAuthProvider,
} from "./config";

export async function getEnabledOAuthProviders(): Promise<OAuthProvider[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const settings = (await res.json()) as { external?: Record<string, boolean> };
    return SUPPORTED_OAUTH_PROVIDERS.filter((provider) => settings.external?.[provider] === true);
  } catch {
    return [];
  }
}
