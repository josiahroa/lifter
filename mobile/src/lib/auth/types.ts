import { z } from "zod";

export const UserSessionSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.number(),
  user: z.object({
    id: z.string(),
    email: z.string(),
  }),
  // optional fields
  email: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

export const AuthChangeEventSchema = z.enum([
  "INITIAL_SESSION",
  "SIGNED_IN",
  "SIGNED_OUT",
  "TOKEN_REFRESHED",
  "USER_UPDATED",
  "PASSWORD_RECOVERY",
  "UNKNOWN",
]);

export type AuthChangeEvent = z.infer<typeof AuthChangeEventSchema>;

export const OTPMethodSchema = z.enum(["email", "phone"]);

export type OTPMethod = z.infer<typeof OTPMethodSchema>;

export type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: UserSession | null
) => void;

export interface AuthChangeSubscription {
  id: string | symbol;
  callback: AuthChangeCallback;
  unsubscribe: () => void;
}

export interface SignInPayload {
  email: { email: string; password: string };
  google: { code: string };
  apple: { code: string };
  otp: { method: OTPMethod; id: string; code: string };
}

export interface RequestOTPCodeResponse {
  success: boolean;
  message: string;
}

export type SignInMethod = keyof SignInPayload;

export interface AuthBackend {
  signInWithEmail(email: string, password: string): Promise<UserSession | null>;
  signInWithOTP(
    method: OTPMethod,
    id: string,
    code: string
  ): Promise<UserSession | null>;
  signInWithGoogle(code: string): Promise<UserSession | null>;
  signInWithApple(code: string): Promise<UserSession | null>;

  signUpWithEmail(email: string, password: string): Promise<UserSession | null>;
  confirmEmail(email: string, token: string): Promise<UserSession | null>;

  requestOTPCode(
    method: OTPMethod,
    id: string
  ): Promise<RequestOTPCodeResponse>;

  getSession(): Promise<UserSession | null>;
  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription;
  logout(): Promise<void>;
}
