import { Controller, Post, Body, Version, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "src/lib/zod-validation-pipe";
import {
  type RequestOTPCodeRequestBody,
  RequestOTPCodeRequestSchema,
  RequestOTPCodeResponseBody,
} from "@lifter/auth";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("request-otp")
  @Version("1")
  @UsePipes(new ZodValidationPipe(RequestOTPCodeRequestSchema))
  requestOTPCode(
    @Body() body: RequestOTPCodeRequestBody
  ): Promise<RequestOTPCodeResponseBody> {
    return this.authService.requestOTPCode(body);
  }

  @Post("confirm-otp")
  @Version("1")
  confirmOTPCode(@Body() body: any): { success: boolean; message: string } {
    return this.authService.confirmOTPCode(body);
  }
}
