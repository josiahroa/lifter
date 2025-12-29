import { DbLike } from "@/src/types";
import z from "zod";
import { sessions } from "@/src/schema/auth";
import { createSelectSchema } from "drizzle-zod";

export const sessionSelectSchema = createSelectSchema(sessions);
type Session = z.infer<typeof sessionSelectSchema>;

export const InsertSessionSchema = z.object({
  userId: z.string(),
});
type InsertSession = z.infer<typeof InsertSessionSchema>;

export class SessionRepository {
  constructor(private readonly db: DbLike) {}

  async insertSession(payload: InsertSession): Promise<Session> {
    const parsed = InsertSessionSchema.parse(payload);
    const session = await this.db.insert(sessions).values(parsed).returning();
    return session[0];
  }
}
