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

// Create individual schemas for each OTP method
const RequestOTPCodeEmailSchema = z.object({
  method: z.literal("email"),
  email: z.email(),
});

const RequestOTPCodePhoneSchema = z.object({
  method: z.literal("phone"),
  phone: z.string(),
});

export const RequestOTPCodeRequestSchema = z.discriminatedUnion("method", [
  RequestOTPCodeEmailSchema,
  RequestOTPCodePhoneSchema,
]);

export type RequestOTPCodeRequestBody = z.infer<
  typeof RequestOTPCodeRequestSchema
>;

export const RequestOTPCodeResponseSchema = z.object({
  userId: z.string(),
  method: OTPMethodSchema,
});

export type RequestOTPCodeResponseBody = z.infer<
  typeof RequestOTPCodeResponseSchema
>;

export const SignInWithOTPRequestSchema = z.object({
  userId: z.string(),
  /**
   * The method of authentication, this is the method of authentication that the user will use to
   * receive the OTP code
   * @example "email"
   * @example "phone"
   */
  method: OTPMethodSchema,
  /**
   * The raw OTP code that the user will enter that should match the one they received
   * @example "123456"
   */
  rawOTPCode: z.string(),
});

export type SignInWithOTPRequestBody = z.infer<
  typeof SignInWithOTPRequestSchema
>;

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
    body: RequestOTPCodeRequestBody
  ): Promise<RequestOTPCodeResponseBody>;

  getSession(): Promise<UserSession | null>;
  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription;
  logout(): Promise<void>;
}
