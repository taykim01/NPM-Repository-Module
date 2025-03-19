import { Cookies } from "./supabase-client.js";
export default class AuthRepository {
    url: string;
    apiKey: string;
    cookies: Cookies;
    constructor(url: string, apiKey: string, cookies: Cookies);
    signInWithEmail(email: string, password: string): Promise<string>;
    signUpWithEmail(email: string, password: string): Promise<string>;
    signInWithProvider(provider: "google", redirectURL: string): Promise<string>;
    deleteUser(): Promise<void>;
    sendPasswordChangeRequest(email: string, redirectTo: string): Promise<void>;
    changePassword(newPassword: string): Promise<void>;
    signOut(): Promise<void>;
}
