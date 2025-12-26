import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { DbModule } from "./db/db.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    AuthModule,
    UserModule,
    DbModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
