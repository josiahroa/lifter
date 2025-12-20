import { SignInStrategyFactory } from "../auth/strategies";
import { AuthClient } from "../auth/client";
import {
  AuthBackend,
  AuthChangeCallback,
  AuthChangeSubscription,
  UserSession,
  UserSessionSchema,
  AuthChangeEventSchema,
  AuthChangeEvent,
} from "../auth/types";
import { client } from "./client";
import {
  AuthChangeEvent as SupabaseAuthChangeEvent,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";

export type SupabaseOAuthProvider = "google" | "apple";

export class SupabaseAuthBackend implements AuthBackend {
  constructor(private readonly supabase: SupabaseClient = client) {}

  async signInWithEmail(email: string, password: string): Promise<UserSession> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(`Failed to sign in with email: ${error.message}`);
      }

      return this.buildUserSession(data.session);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<UserSession | null> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(`Failed to sign up with email: ${error.message}`);
      }

      if (!data.session) {
        // The user needs to verify their email before they can sign in
        return null;
      }

      return this.buildUserSession(data.session);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  async confirmEmail(email: string, token: string): Promise<UserSession> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        token,
        type: "email",
        email: email,
      });

      if (error) {
        throw new Error(`Failed to confirm email: ${error.message}`);
      }

      if (!data.session) {
        throw new Error(`No session found`);
      }

      return this.buildUserSession(data.session);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  async signInWithGoogle(code: string): Promise<UserSession> {
    return this.signInWithOAuth("google", code);
  }

  async signInWithApple(code: string): Promise<UserSession> {
    return this.signInWithOAuth("apple", code);
  }

  async getSession(): Promise<UserSession | null> {
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        throw new Error(`Failed to get session: ${error.message}`);
      }

      if (!data.session) {
        console.log("no session found");
        return null;
      }

      return this.buildUserSession(data.session);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange(
      (event: SupabaseAuthChangeEvent, session: Session | null) => {
        callback(
          this.buildAuthChangeEvent(event),
          session ? this.buildUserSession(session) : null
        );
      }
    );

    return {
      id: subscription.id,
      callback,
      unsubscribe: () => subscription.unsubscribe(),
    };
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  private async signInWithOAuth(
    provider: SupabaseOAuthProvider,
    code: string
  ): Promise<UserSession> {
    try {
      const { data, error } = await this.supabase.auth.signInWithIdToken({
        provider,
        token: code,
      });

      console.log("data", data);

      if (error) {
        throw new Error(`Failed to sign in with OAuth: ${error.message}`);
      }

      return this.buildUserSession(data.session);
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  /**
   * Safely builds a UserSession from a Supabase Session.
   * @param session - The Supabase Session to build a UserSession from.
   * @returns The UserSession.
   */
  private buildUserSession(session: Session): UserSession {
    const parsed = UserSessionSchema.parse({
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? 0,
      expiresIn: session.expires_in,
    });

    return parsed;
  }

  /**
   * Safely maps a SupabaseAuthChangeEvent to an AuthChangeEvent.
   * @param event - The SupabaseAuthChangeEvent to build an AuthChangeEvent from.
   * @returns The AuthChangeEvent.
   */
  private buildAuthChangeEvent(
    event: SupabaseAuthChangeEvent
  ): AuthChangeEvent {
    const parsed = AuthChangeEventSchema.safeParse(event);
    if (!parsed.success) {
      return "UNKNOWN";
    }
    return parsed.data;
  }
}

export const auth = new AuthClient(
  new SupabaseAuthBackend(),
  new SignInStrategyFactory()
);
