import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

import {
  OTPChannel,
  OTPPurpose,
  OTPService,
} from "@/src/modules/auth/otp/otp.service";
import { SessionService } from "@/src/modules/session/session.service";
import { UserId } from "@/src/modules/user/user.domain";
import { UserService } from "@/src/modules/user/user.service";

export interface StartOTPChallengeInput {
  channel: OTPChannel;
  identifier: string;
  purpose: OTPPurpose;
}

export interface StartOTPChallengeResult {
  challengeId: string;
}

export interface VerifyOTPChallengeInput {
  challengeId: string;
  code: string;
  channel: OTPChannel;
  identifier: string;
  purpose: OTPPurpose;
}

export interface VerifyOTPChallengeResult {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string;
  user: {
    id: UserId;
  };
}

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionResult {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string;
  user: {
    id: UserId;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly otpService: OTPService
  ) {}

  async startOTPChallenge(
    input: StartOTPChallengeInput
  ): Promise<StartOTPChallengeResult> {
    const challenge = await this.otpService.createChallenge(input);

    if (input.channel === "email") {
      // TODO: Send OTP to the email
    } else if (input.channel === "phone") {
      // TODO: Send OTP to the phone
    }

    return challenge;
  }

  async verifyOTPChallenge(
    input: VerifyOTPChallengeInput
  ): Promise<VerifyOTPChallengeResult> {
    try {
      await this.otpService.verifyChallenge(input);

      // Get existing user or create a new one with the identifier and channel
      let userId: UserId | null = null;
      const existingUser = await this.userService.getUserByEmail({
        email: input.identifier,
      });

      if (!existingUser) {
        console.log("creating new user");
        const newUser = await this.userService.createVerifiedUser({
          email: input.identifier,
        });
        if (!newUser) {
          throw new InternalServerErrorException("Failed to create user");
        }
        userId = newUser.id;
      } else {
        console.log("user already exists");
        userId = existingUser.id ?? null;
      }

      // Verify that the found or created user has an ID
      if (!userId) {
        throw new InternalServerErrorException("Failed to find or create user");
      }

      return await this.sessionService.createSession({ userId });
    } catch (error) {
      console.error("Error verifying OTP challenge: ", error);
      throw new UnauthorizedException("Unauthorized");
    }
  }

  async refreshSession(
    input: RefreshSessionInput
  ): Promise<RefreshSessionResult> {
    const session = await this.sessionService.refreshSession({
      refreshToken: input.refreshToken,
    });

    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    return {
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
      refreshToken: session.refreshToken,
      user: {
        id: session.user.id,
      },
    };
  }
}
