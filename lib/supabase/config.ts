// Both values ship to the browser by design; Row Level Security protects the data.
export const SUPABASE_URL = "https://PROJECT_REF.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__DXJ3UEmk6K6iiW09hiTaA_-ULyS7HA";

// Add a provider here only after it is enabled in Supabase → Authentication → Providers.
export const OAUTH_PROVIDERS: readonly OAuthProvider[] = [];

export type OAuthProvider = "google" | "facebook";
