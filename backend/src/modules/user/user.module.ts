import { Module } from "@nestjs/common";

import { Db } from "@lifter/db";
import { UserRepository } from "@lifter/db/repositories";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

import { DB_CONNECTION } from "@/src/modules/db/db.module";

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
