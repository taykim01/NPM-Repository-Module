import { Cookies, createClient } from "./supabase-client.js";

export class AuthRepository {
  constructor(
    public url: string,
    public apiKey: string,
    public cookies: Cookies
  ) {}

  async signInWithEmail(email: string, password: string) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const isInvalidCredentials = error.message.includes(
        "Invalid login credentials"
      );
      if (isInvalidCredentials) throw new Error("Invalid login credentials");
      else throw new Error(error.message);
    }
    const userID = data?.user?.id;
    if (!userID) throw new Error("Sign in failed");
    return userID;
  }

  async signUpWithEmail(email: string, password: string) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    const userID = data?.user?.id;
    if (!userID) throw new Error("Sign up failed");
    return userID;
  }

  async signInWithProvider(provider: "google", redirectURL: string) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: {
          prompt: "select_account",
        },
        redirectTo: `${redirectURL}/api/v1/auth/callback`,
      },
    });
    if (error) throw new Error(error.message);
    const url = data.url;
    return url;
  }

  async deleteUser() {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { data: user } = await supabase.auth.getUser();
    const userID = user.user?.id;
    if (!userID) throw new Error("User not found");
    const { error } = await supabase.auth.admin.deleteUser(userID);
    if (error) throw new Error(error.message);
  }

  async sendPasswordChangeRequest(email: string, redirectTo: string) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw new Error(error.message);
  }

  async changePassword(newPassword: string) {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
  }

  async signOut() {
    const supabase = await createClient(this.url, this.apiKey, this.cookies);
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
}
