import { Injectable, NotFoundException } from "@nestjs/common";
import { type User, type DbConnection, users } from "@lifter/db";
import { InjectDb } from "src/db/inject-db.decorator";
import { eq } from "drizzle-orm";

@Injectable()
export class UserService {
  constructor(@InjectDb() private readonly db: DbConnection) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      throw new NotFoundException("User not found");
    }

    return user[0];
  }
}
