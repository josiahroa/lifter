import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/config/env.validation";
import KeyvRedis from "@keyv/redis";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt-auth.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const redisUrl = configService.get("REDIS_URL", { infer: true });
        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const jwtSecret = configService.get("JWT_SECRET", { infer: true });
        const jwtExpiresIn = configService.get("JWT_EXPIRES_IN");

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiresIn },
        };
      },
    }),
  ],
})
export class AuthModule {}
