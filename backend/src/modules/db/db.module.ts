import { createDbConnection, type Db } from "@lifter/db";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const DB_CONNECTION = "DB_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory: (configService: ConfigService): Db => {
        const databaseUrl = configService.get<string>("DATABASE_URL");
        if (!databaseUrl) {
          throw new Error("DATABASE_URL is not set");
        }
        return createDbConnection(databaseUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CONNECTION],
})
export class DbModule {}
