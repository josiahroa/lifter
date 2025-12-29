import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "@lifter/db/repositories";
import { DB_CONNECTION } from "@/src/modules/db/db.module";
import { Db } from "@lifter/db";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useFactory: (db: Db) => {
        return new UserRepository(db);
      },
      inject: [DB_CONNECTION],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
