import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  type StartOTPRequest,
  type StartOTPResponse,
  type VerifyOTPRequest,
  OTPChannelSchema,
  OTPPurposeSchema,
  RefreshTokenRequest,
  UserSession,
} from "@lifter/auth";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import crypto from "crypto";
import { Env } from "@/src/config/env.validation";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";
import { UserService } from "@/src/modules/user/user.service";
import { SessionService } from "../session/session.service";

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
    private readonly configService: ConfigService<Env, true>,
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  async startOTPChallenge(body: StartOTPRequest): Promise<StartOTPResponse> {
    // TODO: Remove, this is for development
    console.log("startOTPChallenge body", body);

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
      purpose: body.purpose,
      channel: body.channel,
      identifier: body.identifier,
    };
    await this.cacheManager.set(key, value, 300000);

    // TODO: Remove, this is for development
    console.log("otp stored in cache successfully: ", key);

    return { challengeId };
  }

  async verifyOTPChallenge(body: VerifyOTPRequest): Promise<UserSession> {
    try {
      const cachedValue = await this.cacheManager.get(
        `otp:${body.challengeId}`
      );

      const parsedCachedValue = OTPCacheSchema.parse(cachedValue);
      const hashedOTPCode = parsedCachedValue.hashedOTPCode;

      if (parsedCachedValue.channel !== body.channel) {
        throw new UnauthorizedException("Invalid OTP channel");
      }

      if (parsedCachedValue.identifier !== body.identifier) {
        throw new UnauthorizedException("Invalid OTP identifier");
      }

      if (parsedCachedValue.purpose !== body.purpose) {
        throw new UnauthorizedException("Invalid OTP purpose");
      }

      const receivedOTPCodeHash = crypto
        .createHmac(
          "sha256",
          this.configService.get("OTP_SECRET", { infer: true })
        )
        .update(body.code)
        .digest("hex");

      if (hashedOTPCode !== receivedOTPCodeHash) {
        throw new UnauthorizedException("Invalid OTP code");
      }

      // Delete the cached value after successful verification
      await this.cacheManager.del(`otp:${body.challengeId}`);

      // Get existing user or create a new one with the identifier and channel
      let user = await this.userService.getUser({
        id: body.identifier,
        idType: body.channel,
      });

      if (!user) {
        console.log("creating new user");
        user = await this.userService.createUser({
          id: body.identifier,
          idType: body.channel,
        });
      } else {
        console.log("user already exists");
      }

      // Create a new user session
      const session = await this.sessionService.issueSession(user.id);
      console.log("session", session);

      return {
        user: { id: user.id },
        accessToken: "",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      };
    } catch (error) {
      console.error("Error verifying OTP challenge: ", error);
      throw new UnauthorizedException("Unauthorized");
    }
  }

  async refreshToken(body: RefreshTokenRequest): Promise<UserSession> {
    console.log("refreshToken body", body);

    return Promise.resolve({
      user: { id: "123" },
      accessToken: "123",
      refreshToken: "123",
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    });
  }
}
