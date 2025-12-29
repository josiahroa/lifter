import { Injectable } from "@nestjs/common";
import { generateRefreshToken, hashRefreshToken } from "./lib/utils";
import { JwtService } from "@nestjs/jwt";
import { InjectDb } from "../db/inject-db.decorator";
import type { Db } from "@lifter/db";
import { SessionStore } from "@lifter/db/stores";

@Injectable()
export class SessionService {
  constructor(
    @InjectDb() private readonly db: Db,
    private readonly jwtService: JwtService
  ) {}

  async issueSession(userId: string) {
    const now = new Date();
    const expiresAtMs = new Date(now.getTime() + 3599); // 59 minutes

    const claims = {
      iss: "lifter-backend",
      aud: "lifter-frontend",
      sub: userId,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiresAtMs.getTime() / 1000),
    };
    const accessToken = this.jwtService.sign(claims);

    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.db.transaction(async (tx) => {
      const store = SessionStore.withTransaction(tx);

      const session = await store.sessionRepository.insertSession({
        userId,
      });

      await store.refreshTokenRepository.insertRefreshToken({
        sessionId: session.id,
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days
      });
    });

    return {
      accessToken,
      expiresAt: expiresAtMs,
      refreshToken,
      user: {
        id: userId,
      },
    };
  }
}
