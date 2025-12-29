import { z } from "zod";

export const UserSessionSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.number(),
  user: z.object({
    id: z.string(),
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

export type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: UserSession | null
) => void;

export interface AuthChangeSubscription {
  id: string | symbol;
  callback: AuthChangeCallback;
  unsubscribe: () => void;
}

export const OTPChannelSchema = z.enum(["email", "phone"]);
export type OTPChannel = z.infer<typeof OTPChannelSchema>;

export const OTPPurposeSchema = z.enum(["sign_in"]);
export type OTPPurpose = z.infer<typeof OTPPurposeSchema>;

export const StartOTPRequestSchema = z.object({
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
});
export type StartOTPRequest = z.infer<typeof StartOTPRequestSchema>;

export const StartOTPResponseSchema = z.object({
  challengeId: z.string(),
});
export type StartOTPResponse = z.infer<typeof StartOTPResponseSchema>;

export const VerifyOTPRequestSchema = z.object({
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
  challengeId: z.string(),
  code: z.string(),
});
export type VerifyOTPRequest = z.infer<typeof VerifyOTPRequestSchema>;

export const SignInPayloadSchema = z.object({
  email: z.object({ email: z.string(), password: z.string() }),
  google: z.object({ code: z.string() }),
  apple: z.object({ code: z.string() }),
  otp: VerifyOTPRequestSchema,
});
export type SignInPayload = z.infer<typeof SignInPayloadSchema>;
export type SignInMethod = keyof SignInPayload;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export interface AuthBackend {
  signInWithEmail(email: string, password: string): Promise<UserSession | null>;
  /**
   * Verify a challenge with the OTP code sent to the channel specified in the StartOTPRequest.
   * If the OTP code is valid, the client will be authenticated and a user session will be returned.
   * @param body - The request body containing the challenge ID and code
   * @returns The user session if successful, null otherwise
   */
  signInWithOTP(body: VerifyOTPRequest): Promise<UserSession | null>;
  signInWithGoogle(code: string): Promise<UserSession | null>;
  signInWithApple(code: string): Promise<UserSession | null>;

  signUpWithEmail(email: string, password: string): Promise<UserSession | null>;
  confirmEmail(email: string, token: string): Promise<UserSession | null>;

  /**
   * Starts an OTP challenge for the given channel, identifier, and purpose
   * @param body - The request body containing the channel, identifier, and purpose
   * @returns The response containing the challenge ID
   */
  startOTPChallenge(body: StartOTPRequest): Promise<StartOTPResponse>;

  getSession(): Promise<UserSession | null>;
  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription;
  logout(): Promise<void>;
}
