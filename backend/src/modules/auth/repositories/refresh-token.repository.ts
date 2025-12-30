import type { DbLike } from "@/src/modules/db/types";

export class RefreshTokenRepository {
  constructor(private readonly db: DbLike) {}

  async insertRefreshToken(): Promise<void> {}

  async findRefreshToken(): Promise<void> {}

  async rotateRefreshToken(): Promise<void> {}

  async revokeRefreshToken(): Promise<void> {}
}
