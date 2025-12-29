import { SessionRepository } from "@/src/repositories";
import { RefreshTokenRepository } from "@/src/repositories";
import { Tx } from "@/src/types";

export class SessionStore {
  constructor(
    readonly sessionRepository: SessionRepository,
    readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  static withTransaction(tx: Tx) {
    return new SessionStore(
      new SessionRepository(tx),
      new RefreshTokenRepository(tx)
    );
  }
}
