import crypto from "crypto";

import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";

import { Env } from "@/src/config/env.validation";

export const OTPChannelSchema = z.enum(["email", "phone"]);
export type OTPChannel = z.infer<typeof OTPChannelSchema>;

export const OTPPurposeSchema = z.enum([
  "sign_in",
  "sign_up",
  "reset_password",
  "verify_email",
  "verify_phone",
]);
export type OTPPurpose = z.infer<typeof OTPPurposeSchema>;

export const OTPCacheSchema = z.object({
  hashedOTPCode: z.string(),
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
});
type OTPCache = z.infer<typeof OTPCacheSchema>;

export interface CreateChallengeInput {
  channel: OTPChannel;
  identifier: string;
  purpose: OTPPurpose;
}

export interface CreateChallengeResult {
  challengeId: string;
}

export interface VerifyChallengeInput {
  challengeId: string;
  code: string;
  channel: OTPChannel;
  identifier: string;
  purpose: OTPPurpose;
}

export interface VerifyChallengeResult {
  success: boolean;
}

@Injectable()
export class OTPService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService<Env, true>
  ) {}

  async createChallenge(
    input: CreateChallengeInput
  ): Promise<CreateChallengeResult> {
    const challengeId = crypto.randomUUID();

    // Generate a random 6 digit OTP code and hash it with the secret key
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hash = crypto
      .createHmac(
        "sha256",
        this.configService.get("OTP_SECRET", { infer: true })
      )
      .update(otp)
      .digest("hex");

    // TODO: Remove, this is for development
    console.log("otp", otp);

    // Store the hashed OTP code in the cache for 5 minutes
    const key = `otp:${challengeId}`;
    const value: OTPCache = {
      hashedOTPCode: hash,
      purpose: input.purpose,
      channel: input.channel,
      identifier: input.identifier,
    };
    // TODO: Currently there is no error thrown if cache set fails, this should be handled before returning
    await this.cacheManager.set(key, value, 300000);

    // TODO: Remove, this is for development
    console.log("otp stored in cache successfully: ", key);

    return { challengeId };
  }

  async verifyChallenge(input: VerifyChallengeInput): Promise<void> {
    const cachedValue = await this.cacheManager.get(`otp:${input.challengeId}`);

    const parsedCachedValue = OTPCacheSchema.parse(cachedValue);
    const hashedOTPCode = parsedCachedValue.hashedOTPCode;

    if (parsedCachedValue.channel !== input.channel) {
      throw new UnauthorizedException("Invalid OTP channel");
    }

    if (parsedCachedValue.identifier !== input.identifier) {
      throw new UnauthorizedException("Invalid OTP identifier");
    }

    if (parsedCachedValue.purpose !== input.purpose) {
      throw new UnauthorizedException("Invalid OTP purpose");
    }

    const receivedOTPCodeHash = crypto
      .createHmac(
        "sha256",
        this.configService.get("OTP_SECRET", { infer: true })
      )
      .update(input.code)
      .digest("hex");

    if (hashedOTPCode !== receivedOTPCodeHash) {
      throw new UnauthorizedException("Invalid OTP code");
    }

    // Delete the cached value after successful verification
    await this.cacheManager.del(`otp:${input.challengeId}`);
  }
}
