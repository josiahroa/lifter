import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

import { Db } from "@/src/lib/db";
import { DB_CONNECTION } from "@/src/modules/db/db.module";
import { UserRepository } from "@/src/modules/user/user.repository";

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
