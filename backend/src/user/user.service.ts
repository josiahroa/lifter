import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { type User, type DbConnection, users, eq } from "@lifter/db";
import { InjectDb } from "@/src/db/inject-db.decorator";

@Injectable()
export class UserService {
  constructor(@InjectDb() private readonly db: DbConnection) {}

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (user.length === 0) {
        throw new NotFoundException("User not found");
      }

      return user[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error("Error getting user by email: ", error);
      throw new InternalServerErrorException("Error getting user by email");
    }
  }

  async createUserByEmail(email: string): Promise<User> {
    const user = await this.db.insert(users).values({ email }).returning();
    return user[0];
  }
}
