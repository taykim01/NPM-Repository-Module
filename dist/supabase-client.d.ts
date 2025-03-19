export interface Cookies {
    getAll: () => {
        name: string;
        value: string;
    }[];
    setAll: (cookiesToSet: {
        name: string;
        value: string;
        options?: any;
    }[]) => void;
}
export declare function createClient(url: string, apiKey: string, cookies: Cookies): Promise<import("@supabase/supabase-js").SupabaseClient<any, "public", any>>;
