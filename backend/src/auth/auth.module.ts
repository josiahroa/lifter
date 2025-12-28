import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/config/env.validation";
import KeyvRedis from "@keyv/redis";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [
    UserModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const redisUrl = configService.get("REDIS_URL", { infer: true });
        return {
          stores: [new KeyvRedis(redisUrl)],
        };
      },
    }),
    ConfigModule,
  ],
})
export class AuthModule {}
