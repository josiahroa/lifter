import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { generateRefreshToken, hashRefreshToken } from "./lib/utils";
import { Session } from "./session.domain";

import { type DbLike } from "@/src/lib/db";
import { InjectDb } from "@/src/modules/db/inject-db.decorator";
import { RefreshToken } from "@/src/modules/session/refresh-token/refresh-token.domain";
import { SessionStore } from "@/src/modules/session/session.store";
import { type UserId } from "@/src/modules/user/user.domain";

export interface CreateSessionInput {
  userId: UserId;
}

export interface CreateSessionResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: {
    id: UserId;
  };
}

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: {
    id: UserId;
  };
}

@Injectable()
export class SessionService {
  constructor(
    @InjectDb() private readonly db: DbLike,
    private readonly jwtService: JwtService
  ) {}

  async createSession(input: CreateSessionInput): Promise<CreateSessionResult> {
    const now = new Date();

    // Create access token
    const claims = {
      iss: "lifter-backend",
      aud: "lifter-frontend",
      sub: input.userId,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(now.getTime() / 1000) + 60 * 60, // 1 hour
    };
    const accessToken = this.jwtService.sign(claims);

    // Create refresh token
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Insert session and refresh token into database
    await this.db.transaction(async (tx) => {
      const store = SessionStore.withTransaction(tx);

      const session = Session.create({ userId: input.userId });

      const insertedSessionId = await store.sessionRepository.insertSession(
        session
      );

      if (!insertedSessionId) {
        throw new InternalServerErrorException("Failed to create session");
      }

      const refreshTokenRecord = RefreshToken.create({
        sessionId: insertedSessionId,
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days
      });

      const insertedRefreshTokenId =
        await store.refreshTokenRepository.insertRefreshToken(
          refreshTokenRecord
        );

      if (!insertedRefreshTokenId) {
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
        id: input.userId,
      },
    };
  }

  async refreshSession(
    input: RefreshSessionInput
  ): Promise<RefreshSessionResult> {
    const incomingHashedRefreshToken = hashRefreshToken(input.refreshToken);

    return await this.db.transaction(async (tx) => {
      const now = Date.now();
      const store = SessionStore.withTransaction(tx);

      const existingRefreshTokenRecord =
        await store.refreshTokenRepository.findRefreshToken(
          incomingHashedRefreshToken
        );

      if (!existingRefreshTokenRecord || !existingRefreshTokenRecord.id) {
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
        // TODO: Track with metrics for re-use
        await store.sessionRepository.revokeSession(
          existingRefreshTokenRecord.sessionId,
          new Date(now)
        );
        await store.refreshTokenRepository.revokeRefreshToken(
          existingRefreshTokenRecord.sessionId,
          new Date(now)
        );
        throw new UnauthorizedException("Refresh token re-use detected");
      }

      const session = await store.sessionRepository.findSession(
        existingRefreshTokenRecord.sessionId
      );

      if (!session || !session.id) {
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

      // Generate new refresh token values
      const newRefreshToken = generateRefreshToken();
      const newRefreshTokenHashed = hashRefreshToken(newRefreshToken);

      const rotatedRefreshTokenRecord =
        await store.refreshTokenRepository.rotateRefreshToken(
          existingRefreshTokenRecord.id,
          new Date(now),
          newRefreshTokenHashed
        );

      // Check if there was a concurrent update that caused the rotation to fail
      if (!rotatedRefreshTokenRecord) {
        // TODO: Track with metrics for failed token rotations
        await store.sessionRepository.revokeSession(session.id, new Date(now));
        await store.refreshTokenRepository.revokeRefreshToken(
          session.id,
          new Date(now)
        );
        throw new UnauthorizedException("Failed to rotate refresh token");
      }

      const newRefreshTokenRecord = RefreshToken.create({
        sessionId: session.id,
        tokenHash: newRefreshTokenHashed,
        expiresAt: new Date(now + 180 * 24 * 60 * 60 * 1000), // 180 days
      });

      const insertedNewRefreshTokenId =
        await store.refreshTokenRepository.insertRefreshToken(
          newRefreshTokenRecord
        );

      if (!insertedNewRefreshTokenId) {
        throw new InternalServerErrorException(
          "Failed to create new refresh token"
        );
      }

      return {
        accessToken,
        expiresAt: new Date(now + 60 * 60 * 1000),
        refreshToken: newRefreshToken,
        user: {
          id: session.userId,
        },
      };
    });
  }
}
