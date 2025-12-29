import type { DbLike } from "@/src/types";
import { refreshTokens } from "@/src/schema/auth";
import { z } from "zod";

export const InsertRefreshTokenSchema = z.object({
  sessionId: z.uuid(),
  tokenHash: z.string(),
  expiresAt: z.date(),
});
type InsertRefreshToken = z.infer<typeof InsertRefreshTokenSchema>;

export class RefreshTokenRepository {
  constructor(private readonly db: DbLike) {}

  async insertRefreshToken(payload: InsertRefreshToken): Promise<void> {
    const parsed = InsertRefreshTokenSchema.parse(payload);
    await this.db.insert(refreshTokens).values(parsed);
  }
}
