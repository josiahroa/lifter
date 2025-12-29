import { Controller, Get, Query, UseGuards, Version } from "@nestjs/common";
import { JwtAuthGuard } from "@/src/modules/auth/guards/jwt-auth.guard";

@Controller("user")
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @Version("1")
  getUserProfile(@Query("userId") userId: string) {
    return {
      userId,
    };
  }
}
