import { eq } from "drizzle-orm";

import { DbLike, refreshTokens } from "@/src/lib/db";
import {
  RefreshToken,
  RefreshTokenId,
} from "@/src/modules/session/refresh-token/refresh-token.domain";
import { SessionId } from "@/src/modules/session/session.domain";

export class RefreshTokenRepository {
  constructor(private readonly db: DbLike) {}

  async insertRefreshToken(
    refreshToken: RefreshToken
  ): Promise<RefreshTokenId> {
    const [createdRefreshToken] = await this.db
      .insert(refreshTokens)
      .values(refreshToken)
      .returning();

    return createdRefreshToken.id;
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    const [refreshToken] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));

    if (!refreshToken) {
      return null;
    }
    return RefreshToken.rehydrate(refreshToken);
  }

  async rotateRefreshToken(
    id: RefreshTokenId,
    rotatedAt: Date,
    replacedByHash: string
  ): Promise<RefreshToken | null> {
    const [rotatedRefreshToken] = await this.db
      .update(refreshTokens)
      .set({ rotatedAt, replacedByHash })
      .where(eq(refreshTokens.id, id))
      .returning();

    if (!rotatedRefreshToken) {
      return null;
    }

    return RefreshToken.rehydrate(rotatedRefreshToken);
  }

  async revokeRefreshToken(
    sessionId: SessionId,
    revokedAt: Date
  ): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt })
      .where(eq(refreshTokens.sessionId, sessionId));
  }
}
