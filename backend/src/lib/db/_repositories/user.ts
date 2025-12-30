// import { users } from "@/src/schema/auth";
// import type { DbLike, User } from "@/src/types";
// import { eq } from "drizzle-orm";
// import { z } from "zod";

// const UserInsertSchema = z
//   .object({
//     email: z.email().optional(),
//     emailVerified: z.boolean().optional(),
//     phone: z.string().optional(),
//     phoneVerified: z.boolean().optional(),
//   })
//   .refine((data) => data.phone || data.email, {
//     message: "Either phone or email must be provided",
//     path: ["phone", "email"],
//   });
// type UserInsert = z.infer<typeof UserInsertSchema>;

// export class UserRepository {
//   constructor(private readonly db: DbLike) {}

//   async createUser(user: UserInsert): Promise<User> {
//     const validatedUser = UserInsertSchema.parse(user);
//     const createdUser = await this.db
//       .insert(users)
//       .values(validatedUser)
//       .returning();

//     return createdUser[0];
//   }

//   async getUserById(id: string): Promise<User | null> {
//     const user = await this.db.select().from(users).where(eq(users.id, id));
//     return user[0];
//   }

//   async getUserByEmail(email: string): Promise<User | null> {
//     const user = await this.db
//       .select()
//       .from(users)
//       .where(eq(users.email, email));
//     return user[0];
//   }
// }
