import { Tx } from "@/src/lib/db";
import { RefreshTokenRepository } from "@/src/modules/session/refresh-token/refresh-token.repository";
import { SessionRepository } from "@/src/modules/session/session.repository";

export class SessionStore {
  constructor(
    readonly sessionRepository: SessionRepository,
    readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  static withTransaction(tx: Tx): SessionStore {
    return new SessionStore(
      new SessionRepository(tx),
      new RefreshTokenRepository(tx)
    );
  }
}
