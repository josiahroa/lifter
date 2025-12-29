import { SessionService } from "./session.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/src/config/env.validation";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        const jwtSecret = configService.get("JWT_SECRET", { infer: true });

        return {
          secret: jwtSecret,
        };
      },
    }),
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
