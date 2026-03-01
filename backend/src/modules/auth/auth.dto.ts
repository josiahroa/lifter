import { z } from "zod";

import {
  OTPChannelSchema,
  OTPPurposeSchema,
} from "@/src/modules/auth/otp/otp.service";

// OTP Start Challenge
export const OtpStartChallengeDtoRequestSchema = z.object({
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
});
export type OtpStartChallengeDtoRequest = z.infer<
  typeof OtpStartChallengeDtoRequestSchema
>;

export const OtpStartChallengeDtoResponseSchema = z.object({
  challengeId: z.string(),
});
export type OtpStartChallengeDtoResponse = z.infer<
  typeof OtpStartChallengeDtoResponseSchema
>;

// OTP Verify Challenge
export const OtpVerifyChallengeDtoRequestSchema = z.object({
  challengeId: z.string(),
  code: z.string(),
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
});
export type OtpVerifyChallengeDtoRequest = z.infer<
  typeof OtpVerifyChallengeDtoRequestSchema
>;
export const OtpVerifyChallengeDtoResponseSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.date(),
  refreshToken: z.string(),
  user: z.object({
    id: z.uuid(),
  }),
});
export type OtpVerifyChallengeDtoResponse = z.infer<
  typeof OtpVerifyChallengeDtoResponseSchema
>;

// Refresh Session
export const RefreshSessionDtoRequestSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshSessionDtoRequest = z.infer<
  typeof RefreshSessionDtoRequestSchema
>;

export const RefreshSessionDtoResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  user: z.object({
    id: z.uuid(),
  }),
});
export type RefreshSessionDtoResponse = z.infer<
  typeof RefreshSessionDtoResponseSchema
>;
