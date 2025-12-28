import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  type StartOTPRequest,
  type StartOTPResponse,
  type VerifyOTPRequest,
  OTPChannelSchema,
  OTPPurposeSchema,
  StartOTPRequestSchema,
  VerifyOTPRequestSchema,
} from "@lifter/auth";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import crypto from "crypto";
import { Env } from "@/src/config/env.validation";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";

const OTPCacheSchema = z.object({
  hashedOTPCode: z.string(),
  channel: OTPChannelSchema,
  identifier: z.string(),
  purpose: OTPPurposeSchema,
});
type OTPCache = z.infer<typeof OTPCacheSchema>;

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService<Env, true>
  ) {}

  async startOTPChallenge(body: StartOTPRequest): Promise<StartOTPResponse> {
    console.log("startOTPChallenge body", body);

    const parsed: StartOTPRequest = StartOTPRequestSchema.parse(body);

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

    console.log("otp", otp);

    // Store the hashed OTP code in the cache for 5 minutes
    const key = `otp:${challengeId}`;
    const value: OTPCache = {
      hashedOTPCode: hash,
      purpose: parsed.purpose,
      channel: parsed.channel,
      identifier: parsed.identifier,
    };
    await this.cacheManager.set(key, value, 300000);

    console.log("otp stored in cache successfully: ", key);

    return { challengeId };
  }

  async verifyOTPChallenge(
    body: VerifyOTPRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const parsed: VerifyOTPRequest = VerifyOTPRequestSchema.parse(body);

      const cachedValue = await this.cacheManager.get(
        `otp:${parsed.challengeId}`
      );

      const parsedCachedValue = OTPCacheSchema.parse(cachedValue);
      const hashedOTPCode = parsedCachedValue.hashedOTPCode;

      if (parsedCachedValue.channel !== parsed.channel) {
        throw new UnauthorizedException("Invalid OTP channel");
      }

      if (parsedCachedValue.identifier !== parsed.identifier) {
        throw new UnauthorizedException("Invalid OTP identifier");
      }

      if (parsedCachedValue.purpose !== parsed.purpose) {
        throw new UnauthorizedException("Invalid OTP purpose");
      }

      const receivedOTPCodeHash = crypto
        .createHmac(
          "sha256",
          this.configService.get("OTP_SECRET", { infer: true })
        )
        .update(parsed.code)
        .digest("hex");

      if (hashedOTPCode !== receivedOTPCodeHash) {
        throw new UnauthorizedException("Invalid OTP code");
      }

      // Delete the cached value after successful verification
      await this.cacheManager.del(`otp:${parsed.challengeId}`);

      // Get existing user or create a new one with the identifier and channel

      // Create a new user session

      // Return a UserSession
      console.log(body);
      return Promise.resolve({
        success: true,
        message: "OTP code confirmed",
      });
    } catch (error) {
      console.error("Error verifying OTP challenge: ", error);
      throw new UnauthorizedException("Invalid OTP code");
    }
  }
}
