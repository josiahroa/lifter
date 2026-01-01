import { eq } from "drizzle-orm";

import { DbLike, users } from "@/src/lib/db";
import { User, UserId } from "@/src/modules/user/user.domain";

export class UserRepository {
  constructor(private readonly db: DbLike) {}

  async insertUser(user: User): Promise<UserId> {
    const [createdUser] = await this.db.insert(users).values(user).returning();

    return createdUser.id;
  }

  async findUserById(id: UserId): Promise<User | null> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return null;
    }

    return User.rehydrate({
      ...user,
      id: user.id,
      email: user.email ?? "",
      emailVerified: user.emailVerified,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return null;
    }

    return User.rehydrate({
      ...user,
      id: user.id,
      email: user.email ?? "",
      emailVerified: user.emailVerified,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    });
  }
}
