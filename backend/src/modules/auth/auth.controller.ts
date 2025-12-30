import { Controller, Post, Body, Version, UsePipes } from "@nestjs/common";

import {
  type StartOTPRequest,
  type StartOTPResponse,
  type VerifyOTPRequest,
  StartOTPRequestSchema,
  VerifyOTPRequestSchema,
} from "@lifter/auth";

import { AuthService } from "./auth.service";
import {
  AuthRefreshDtoSchema,
  AuthSessionResponseDtoSchema,
  type AuthRefreshDto,
  type AuthSessionResponseDto,
} from "./dto/refresh-session.dto";

import { ZodValidationPipe } from "@/src/lib/zod-validation-pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("otp/start-challenge")
  @Version("1")
  @UsePipes(new ZodValidationPipe(StartOTPRequestSchema))
  startOTPChallenge(@Body() body: StartOTPRequest): Promise<StartOTPResponse> {
    return this.authService.startOTPChallenge(body);
  }

  @Post("otp/verify-challenge")
  @Version("1")
  @UsePipes(new ZodValidationPipe(VerifyOTPRequestSchema))
  verifyOTPChallenge(@Body() body: VerifyOTPRequest): Promise<unknown> {
    return this.authService.verifyOTPChallenge(body);
  }

  @Post("refresh")
  @Version("1")
  @UsePipes(new ZodValidationPipe(AuthRefreshDtoSchema))
  async refreshToken(
    @Body() body: AuthRefreshDto
  ): Promise<AuthSessionResponseDto> {
    const session = await this.authService.refreshToken(body);
    return AuthSessionResponseDtoSchema.parse(session);
  }
}
