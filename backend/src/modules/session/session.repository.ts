import { eq } from "drizzle-orm";

import { Session, SessionId } from "./session.domain";

import { DbLike, sessions } from "@/src/lib/db";

export class SessionRepository {
  constructor(private readonly db: DbLike) {}

  async insertSession(session: Session): Promise<SessionId> {
    const [createdSession] = await this.db
      .insert(sessions)
      .values(session)
      .returning();

    return createdSession.id;
  }

  async findSession(sessionId: SessionId): Promise<Session | null> {
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!session) {
      return null;
    }

    return Session.rehydrate({
      ...session,
      id: session.id,
      userId: session.userId,
      revokedAt: session.revokedAt ? new Date(session.revokedAt) : null,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    });
  }

  async revokeSession(sessionId: SessionId, revokedAt: Date): Promise<void> {
    await this.db
      .update(sessions)
      .set({ revokedAt })
      .where(eq(sessions.id, sessionId));
  }
}
