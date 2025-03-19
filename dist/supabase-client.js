import { createServerClient } from "@supabase/ssr";
export async function createClient(url, apiKey, cookies) {
    return createServerClient(url, apiKey, { cookies });
}
