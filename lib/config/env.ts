export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    return { configured: false as const, url: null, publishableKey: null };
  }

  try {
    new URL(url);
  } catch {
    return { configured: false as const, url: null, publishableKey: null };
  }

  return { configured: true as const, url, publishableKey };
}
