import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";

export interface UserSession {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string;
  user: {
    id: string;
  };
}

type AuthChangeEvent =
  | "INITIAL_SESSION"
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED";
type AuthListener = (
  event: AuthChangeEvent,
  session: UserSession | null
) => void;

const SESSION_KEY = "lifter.session";
const REFRESH_EARLY_MS = 57 * 60 * 1000; // 5 minutes

export enum LoginMethod {
  OTP = "otp",
  GOOGLE = "google",
  APPLE = "apple",
}

export enum OAuthProvider {
  GOOGLE = "google",
  APPLE = "apple",
}

export interface OTPLoginOptions {
  challengeId: string;
  identifier: string;
  channel: OTPChannel;
  purpose: OTPPurpose;
  code: string;
}

export interface OAuthLoginOptions {
  code: string;
  provider: OAuthProvider;
}

export type LoginOptions = OTPLoginOptions | OAuthLoginOptions;

export enum OTPChannel {
  EMAIL = "email",
  PHONE = "phone",
}

export enum OTPPurpose {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
}

export interface StartOTPResponse {
  challengeId: string;
}

interface AuthBackend {
  startOTPChallenge(
    identifier: string,
    channel: OTPChannel,
    purpose: OTPPurpose
  ): Promise<StartOTPResponse>;
  verifyOTPChallenge(
    challengeId: string,
    code: string,
    channel: OTPChannel,
    identifier: string,
    purpose: OTPPurpose
  ): Promise<UserSession | null>;
  refreshSession(refreshToken: string): Promise<UserSession | null>;
  loginWithOAuth(
    provider: OAuthProvider,
    code: string
  ): Promise<UserSession | null>;
  logout(): Promise<void>;
}

function msUntilRefresh(expiresAt: Date) {
  return expiresAt.getTime() - Date.now() - REFRESH_EARLY_MS;
}

function normalizeSession(input: unknown): UserSession | null {
  if (!input || typeof input !== "object") return null;

  const obj = input as Record<string, unknown>;
  const user =
    obj.user && typeof obj.user === "object"
      ? (obj.user as Record<string, unknown>)
      : null;

  const rawExpiresAt = obj.expiresAt;
  const expiresAt =
    rawExpiresAt instanceof Date
      ? rawExpiresAt
      : new Date(String(rawExpiresAt));
  if (Number.isNaN(expiresAt.getTime())) return null;

  return {
    accessToken: String(obj.accessToken),
    refreshToken: String(obj.refreshToken),
    expiresAt,
    user: { id: String(user?.id) },
  };
}

export class LifterAuthBackend implements AuthBackend {
  constructor(private readonly apiUrl: string) {}

  async startOTPChallenge(
    identifier: string,
    channel: OTPChannel,
    purpose: OTPPurpose
  ): Promise<StartOTPResponse> {
    console.log("starting OTP challenge");
    const url = `${this.apiUrl}/auth/otp/start-challenge`;
    console.log("making request to", url);
    const response = await axios.post<StartOTPResponse>(url, {
      identifier,
      channel,
      purpose,
    });
    return response.data;
  }

  async verifyOTPChallenge(
    challengeId: string,
    code: string,
    channel: OTPChannel,
    identifier: string,
    purpose: OTPPurpose
  ): Promise<UserSession | null> {
    console.log("verifying OTP challenge");
    const response = await axios.post<UserSession>(
      `${this.apiUrl}/auth/otp/verify-challenge`,
      {
        challengeId,
        code,
        channel,
        identifier,
        purpose,
      }
    );
    return normalizeSession(response.data);
  }

  async refreshSession(refreshToken: string): Promise<UserSession | null> {
    console.log("refreshing session");
    const response = await axios.post<UserSession>(
      `${this.apiUrl}/auth/refresh`,
      {
        refreshToken,
      }
    );
    return normalizeSession(response.data);
  }

  async loginWithOAuth(
    provider: OAuthProvider,
    code: string
  ): Promise<UserSession | null> {
    console.log("logging in with OAuth", provider, code);
    console.error("Not implemented");
    return null;
  }

  async logout(): Promise<void> {
    console.log("logging out");
    await axios.post(`${this.apiUrl}/auth/logout`);
  }
}

export class AuthClient {
  private session: UserSession | null = null;
  private listeners = new Set<AuthListener>();
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshInFlight: Promise<UserSession | null> | null = null;
  private hydrated = false;

  constructor(private readonly backend: AuthBackend) {
    // When app returns to foreground, ensure session is refreshed if needed.
    AppState.addEventListener("change", (state) => {
      if (state === "active") void this.getSession();
    });
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.add(callback);
    if (this.hydrated) callback("INITIAL_SESSION", this.session);
    return {
      unsubscribe: () => this.listeners.delete(callback),
    };
  }

  private emit(event: AuthChangeEvent) {
    for (const cb of this.listeners) cb(event, this.session);
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = null;
  }

  private scheduleRefresh() {
    this.clearRefreshTimer();
    if (!this.session) return;

    const delay = msUntilRefresh(this.session.expiresAt);
    if (delay <= 0) {
      void this.refreshSessionSingleFlight();
      return;
    }

    this.refreshTimer = setTimeout(() => {
      void this.refreshSessionSingleFlight();
    }, delay);
  }

  private async hydrateFromStorage() {
    if (this.hydrated) return;
    this.hydrated = true;

    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    this.session = raw ? normalizeSession(JSON.parse(raw)) : null;

    this.emit("INITIAL_SESSION");
    this.scheduleRefresh();
  }

  private async persist() {
    if (!this.session) {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return;
    }
    console.log("persisting session", this.session);
    const toStore = {
      ...this.session,
      expiresAt: this.session.expiresAt.toISOString(),
    };
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(toStore));
  }

  private async setSession(next: UserSession | null, event: AuthChangeEvent) {
    this.session = next;
    await this.persist();
    this.emit(event);
    this.scheduleRefresh();
  }

  async getSession(): Promise<UserSession | null> {
    await this.hydrateFromStorage();
    if (!this.session) return null;

    if (msUntilRefresh(this.session.expiresAt) <= 0) {
      const refreshed = await this.refreshSessionSingleFlight();
      return refreshed;
    }

    return this.session;
  }

  async startOTPChallenge(
    identifier: string,
    channel: OTPChannel,
    purpose: OTPPurpose
  ) {
    return await this.backend.startOTPChallenge(identifier, channel, purpose);
  }

  async loginWithOTP(options: OTPLoginOptions): Promise<UserSession | null> {
    const session = await this.backend.verifyOTPChallenge(
      options.challengeId,
      options.code,
      options.channel,
      options.identifier,
      options.purpose
    );
    if (!session) return null;

    await this.setSession(session, "SIGNED_IN");
    return session;
  }

  async logout(): Promise<void> {
    try {
      await this.backend.logout();
    } catch {
      // ignore
      console.error("Error logging out");
    }
    this.clearRefreshTimer();
    this.refreshInFlight = null;
    await this.setSession(null, "SIGNED_OUT");
  }

  private async refreshSessionSingleFlight(): Promise<UserSession | null> {
    await this.hydrateFromStorage();
    if (!this.session?.refreshToken) {
      await this.setSession(null, "SIGNED_OUT");
      return null;
    }

    if (this.refreshInFlight) return this.refreshInFlight;

    this.refreshInFlight = (async () => {
      try {
        const refreshed = await this.backend.refreshSession(
          this.session!.refreshToken
        );
        if (!refreshed) {
          await this.setSession(null, "SIGNED_OUT");
          return null;
        }
        await this.setSession(refreshed, "TOKEN_REFRESHED");
        return refreshed;
      } finally {
        this.refreshInFlight = null;
      }
    })();

    return this.refreshInFlight;
  }
}

const apiUrl = process.env.EXPO_PUBLIC_LIFTER_BACKEND_API_URL;
if (!apiUrl) {
  throw new Error("LIFTER_BACKEND_API_URL is not set");
}
export const auth = new AuthClient(new LifterAuthBackend(apiUrl));
