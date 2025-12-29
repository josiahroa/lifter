import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { generateRefreshToken, hashRefreshToken } from "./lib/utils";
import { JwtService } from "@nestjs/jwt";
import { InjectDb } from "@/src/modules/db/inject-db.decorator";
import type { Db } from "@lifter/db";
import { SessionStore } from "@lifter/db/stores";
import { UnauthorizedException } from "@nestjs/common";
import type { UserSession } from "@lifter/auth";

@Injectable()
export class SessionService {
  constructor(
    @InjectDb() private readonly db: Db,
    private readonly jwtService: JwtService
  ) {}

  async issueSession(userId: string): Promise<UserSession> {
    const now = new Date();

    // Create access token
    const claims = {
      iss: "lifter-backend",
      aud: "lifter-frontend",
      sub: userId,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(now.getTime() / 1000) + 60 * 60, // 1 hour
    };
    const accessToken = this.jwtService.sign(claims);

    // Create refresh token
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Insert session into database
    await this.db.transaction(async (tx) => {
      const store = SessionStore.withTransaction(tx);

      const session = await store.sessionRepository.insertSession({
        userId,
      });

      if (!session) {
        throw new InternalServerErrorException("Failed to create session");
      }

      const refreshTokenRecord =
        await store.refreshTokenRepository.insertRefreshToken({
          sessionId: session.id,
          tokenHash: hashedRefreshToken,
          expiresAt: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days
        });

      if (!refreshTokenRecord) {
        throw new InternalServerErrorException(
          "Failed to create refresh token"
        );
      }
    });

    return {
      accessToken,
      expiresAt: new Date(now.getTime() + 60 * 60),
      refreshToken,
      user: {
        id: userId,
      },
    };
  }

  async refreshSession(refreshToken: string): Promise<UserSession> {
    const incomingHashedRefreshToken = hashRefreshToken(refreshToken);

    return await this.db.transaction(async (tx) => {
      const now = Date.now();
      const store = SessionStore.withTransaction(tx);

      const existingRefreshTokenRecord =
        await store.refreshTokenRepository.findRefreshToken({
          tokenHash: incomingHashedRefreshToken,
        });

      if (!existingRefreshTokenRecord) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      if (existingRefreshTokenRecord.revokedAt) {
        throw new UnauthorizedException("Refresh token revoked");
      }

      if (existingRefreshTokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException("Refresh token expired");
      }

      if (
        existingRefreshTokenRecord.rotatedAt ||
        existingRefreshTokenRecord.replacedByHash
      ) {
        // TODO: Revoke session
        // TODO: Track with metrics for re-use
        await store.sessionRepository.revokeSession({
          id: existingRefreshTokenRecord.sessionId,
          revokedAt: new Date(now),
        });
        await store.refreshTokenRepository.revokeRefreshToken({
          sessionId: existingRefreshTokenRecord.sessionId,
          revokedAt: new Date(now),
        });
        throw new UnauthorizedException("Refresh token re-use detected");
      }

      const session = await store.sessionRepository.findSession({
        id: existingRefreshTokenRecord.sessionId,
      });

      if (!session) {
        throw new UnauthorizedException("Session not found");
      }

      if (session.revokedAt) {
        throw new UnauthorizedException("Session revoked");
      }

      // Create access token
      const claims = {
        iss: "lifter-backend",
        aud: "lifter-frontend",
        sub: session.userId,
        iat: Math.floor(now / 1000),
        exp: Math.floor(now / 1000) + 60 * 60, // 1 hour
      };
      const accessToken = this.jwtService.sign(claims);

      // Create refresh token
      const newRefreshToken = generateRefreshToken();
      const newRefreshTokenHashed = hashRefreshToken(newRefreshToken);

      const rotatedRefreshTokenRecord =
        await store.refreshTokenRepository.rotateRefreshToken({
          id: existingRefreshTokenRecord.id,
          rotatedAt: new Date(now),
          replacedByHash: newRefreshTokenHashed,
        });

      // Check if there was a concurrent update that caused the rotation to fail
      if (!rotatedRefreshTokenRecord) {
        // TODO: Revoke session
        // TODO: Track with metrics for failed token rotations
        await store.sessionRepository.revokeSession({
          id: session.id,
          revokedAt: new Date(now),
        });
        await store.refreshTokenRepository.revokeRefreshToken({
          sessionId: session.id,
          revokedAt: new Date(now),
        });
        throw new UnauthorizedException("Failed to rotate refresh token");
      }

      await store.refreshTokenRepository.insertRefreshToken({
        sessionId: session.id,
        tokenHash: newRefreshTokenHashed,
        expiresAt: new Date(now + 180 * 24 * 60 * 60 * 1000), // 180 days
      });

      return {
        accessToken,
        expiresAt: new Date(now + 60 * 60 * 1000),
        refreshToken,
        user: {
          id: session.userId,
        },
      };
    });
  }
}
