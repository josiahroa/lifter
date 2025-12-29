import { DbLike } from "@/src/types";
import z from "zod";
import { sessions } from "@/src/schema/auth";
import {
  // createInsertSchema,
  createSelectSchema,
  // createUpdateSchema,
} from "drizzle-zod";
import { eq } from "drizzle-orm";

// drizzle-zod createSelectSchema is not working as expected, so use zod directly for now
// export const SessionInsertSchema = createInsertSchema(sessions);
export const SessionInsertSchema = z.object({
  id: z.uuid().optional(),
  userId: z.uuid(),
  revokedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type SessionInsert = z.infer<typeof SessionInsertSchema>;

export const SessionSelectSchema = createSelectSchema(sessions);
export type SessionSelect = z.infer<typeof SessionSelectSchema>;

// drizzle-zod createUpdateSchema is not working as expected, so use zod directly for now
// export const SessionUpdateSchema = createUpdateSchema(sessions);
export const SessionUpdateSchema = z.object({
  id: z.uuid().optional(),
  userId: z.uuid(),
  revokedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type SessionUpdate = z.infer<typeof SessionUpdateSchema>;

export const FindSessionPayloadSchema = SessionSelectSchema.pick({
  id: true,
});
export type FindSessionPayload = z.infer<typeof FindSessionPayloadSchema>;

export const RevokeSessionPayloadSchema = SessionSelectSchema.pick({
  id: true,
  revokedAt: true,
}).extend({
  id: z.uuid(),
  revokedAt: z.date(),
});
export type RevokeSessionPayload = z.infer<typeof RevokeSessionPayloadSchema>;

export class SessionRepository {
  constructor(private readonly db: DbLike) {}

  /**
   * Inserts a session
   * @param payload - The session to insert
   * @returns The inserted session or null if the operation failed
   */
  async insertSession(payload: SessionInsert): Promise<SessionSelect | null> {
    try {
      const { success, data } = SessionInsertSchema.safeParse(payload);

      if (!success) return null;

      const session = await this.db.insert(sessions).values(data).returning();

      if (session.length === 0) return null;

      const resParsed = SessionSelectSchema.safeParse(session[0]);

      if (!resParsed.success) return null;

      return resParsed.data;
    } catch (error) {
      // Throwing an error will allow the client to retry the operation
      // TOOD: Determine errors that can retry, otherwise, return null
      console.error(error);
      return null;
    }
  }

  /**
   * Finds a session by id
   * @param payload - The session id to find
   * @returns The found session or null if the operation failed
   */
  async findSession(
    payload: FindSessionPayload
  ): Promise<SessionSelect | null> {
    try {
      const { success, data } = FindSessionPayloadSchema.safeParse(payload);

      if (!success) return null;

      const session = await this.db
        .select()
        .from(sessions)
        .where(eq(sessions.id, data.id));

      if (session.length === 0) return null;

      const resParsed = SessionSelectSchema.safeParse(session[0]);

      if (!resParsed.success) return null;

      return resParsed.data;
    } catch (error) {
      // Throwing an error will allow the client to retry the operation
      // TOOD: Determine errors that can retry, otherwise, return null
      console.error(error);
      return null;
    }
  }

  /**
   * Revokes a session
   * @param payload - The session id to revoke
   * @returns The revoked session or null if the operation failed
   */
  async revokeSession(
    payload: RevokeSessionPayload
  ): Promise<SessionSelect | null> {
    try {
      const { success, data } = RevokeSessionPayloadSchema.safeParse(payload);

      if (!success) return null;

      const revokedSession = await this.db
        .update(sessions)
        .set({ revokedAt: data.revokedAt })
        .where(eq(sessions.id, data.id))
        .returning();

      if (revokedSession.length === 0) return null;

      const resParsed = SessionSelectSchema.safeParse(revokedSession[0]);

      if (!resParsed.success) return null;

      return resParsed.data;
    } catch (error) {
      // Throwing an error will allow the client to retry the operation
      // TOOD: Determine errors that can retry, otherwise, return null
      console.error(error);
      return null;
    }
  }
}
