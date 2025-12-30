import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { envSchema } from "./config/env.validation";
import { AuthModule } from "./modules/auth/auth.module";
import { DbModule } from "./modules/db/db.module";
import { SessionModule } from "./modules/session/session.module";
import { UserModule } from "./modules/user/user.module";

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
