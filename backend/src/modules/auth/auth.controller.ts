import { Controller, Post, Body, Version, UsePipes, Get } from "@nestjs/common";

import * as AuthDto from "./auth.dto";
import { AuthService } from "./auth.service";

import { ZodValidationPipe } from "@/src/lib/zod-validation-pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("otp/start-challenge")
  @Version("1")
  @UsePipes(new ZodValidationPipe(AuthDto.OtpStartChallengeDtoRequestSchema))
  async startOTPChallenge(
    @Body() body: AuthDto.OtpStartChallengeDtoRequest
  ): Promise<AuthDto.OtpStartChallengeDtoResponse> {
    const challenge = await this.authService.startOTPChallenge(body);
    return AuthDto.OtpStartChallengeDtoResponseSchema.parse(challenge);
  }

  @Post("otp/verify-challenge")
  @Version("1")
  @UsePipes(new ZodValidationPipe(AuthDto.OtpVerifyChallengeDtoRequestSchema))
  async verifyOTPChallenge(
    @Body() body: AuthDto.OtpVerifyChallengeDtoRequest
  ): Promise<AuthDto.OtpVerifyChallengeDtoResponse> {
    const session = await this.authService.verifyOTPChallenge(body);
    return AuthDto.OtpVerifyChallengeDtoResponseSchema.parse(session);
  }

  @Post("refresh")
  @Version("1")
  @UsePipes(new ZodValidationPipe(AuthDto.RefreshSessionDtoRequestSchema))
  async refreshSession(
    @Body() body: AuthDto.RefreshSessionDtoRequest
  ): Promise<AuthDto.RefreshSessionDtoResponse> {
    const session = await this.authService.refreshSession(body);
    return AuthDto.RefreshSessionDtoResponseSchema.parse(session);
  }

  /**
   * JWKS endpoint for PowerSync JWT verification
   * Public endpoint - no authentication required
   * Returns public keys in JWKS format for RS256 signature verification
   */
  @Get(".well-known/jwks.json")
  @Version("1")
  getJWKS() {
    return this.authService.getJWKS();
  }
}
