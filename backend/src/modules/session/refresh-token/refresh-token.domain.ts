import { SessionId } from "@/src/modules/session/session.domain";

export type RefreshTokenId = string;

export interface RefreshTokenProps {
  sessionId: SessionId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  rotatedAt?: Date | null;
  replacedByHash?: string | null;
}

export interface RefreshTokenPersistedProps extends RefreshTokenProps {
  id: RefreshTokenId;
  createdAt: Date;
  updatedAt: Date;
}

export class RefreshToken {
  public readonly sessionId: SessionId;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  public readonly revokedAt?: Date | null;
  public readonly rotatedAt?: Date | null;
  public readonly replacedByHash?: string | null;

  // Persisted properties handled by the database
  public readonly id?: RefreshTokenId;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(input: RefreshTokenProps & Partial<RefreshTokenPersistedProps>) {
    this.sessionId = input.sessionId;
    this.tokenHash = input.tokenHash;
    this.expiresAt = input.expiresAt;
    this.revokedAt = input.revokedAt;
    this.rotatedAt = input.rotatedAt;
    this.replacedByHash = input.replacedByHash;

    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  public static create(input: RefreshTokenProps): RefreshToken {
    return new RefreshToken(input);
  }

  public static rehydrate(input: RefreshTokenPersistedProps): RefreshToken {
    return new RefreshToken(input);
  }
}
