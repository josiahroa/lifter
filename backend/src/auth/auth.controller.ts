import { Controller, Post, Body, Version } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("request-otp")
  @Version("1")
  requestOTPCode(@Body() body: any): { success: boolean; message: string } {
    return this.authService.requestOTPCode(body);
  }

  @Post("confirm-otp")
  @Version("1")
  confirmOTPCode(@Body() body: any): { success: boolean; message: string } {
    return this.authService.confirmOTPCode(body);
  }
}
