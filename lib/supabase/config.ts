// Both values ship to the browser by design; Row Level Security protects the data.
export const SUPABASE_URL = "https://fvatmkuyyqtpevzlhdjx.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__DXJ3UEmk6K6iiW09hiTaA_-ULyS7HA";

// Buttons appear only for the ones enabled in Supabase → Authentication → Sign In / Providers.
export const SUPPORTED_OAUTH_PROVIDERS = ["facebook", "google"] as const;

export type OAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];
