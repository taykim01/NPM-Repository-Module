import { createServerClient } from "@supabase/ssr";

export interface Cookies {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookiesToSet: { name: string; value: string; options?: any }[]
  ) => void;
}

export async function createClient(
  url: string,
  apiKey: string,
  cookies: Cookies
) {
  return createServerClient(url, apiKey, { cookies });
}
