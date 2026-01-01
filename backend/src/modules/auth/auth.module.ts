import KeyvRedis from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { Env } from "src/config/env.validation";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OTPService } from "./otp/otp.service";
import { JwtStrategy } from "./strategies/jwt-auth.strategy";

import { SessionModule } from "@/src/modules/session/session.module";
import { UserModule } from "@/src/modules/user/user.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OTPService],
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    SessionModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const redisUrl = configService.get("REDIS_URL", { infer: true });
        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
  ],
})
export class AuthModule {}
