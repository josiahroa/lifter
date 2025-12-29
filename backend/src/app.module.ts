import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { AppController } from "./app.controller";
import { UserModule } from "./modules/user/user.module";
import { DbModule } from "./modules/db/db.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./config/env.validation";
import { SessionModule } from "./modules/session/session.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    AuthModule,
    UserModule,
    DbModule,
    SessionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
