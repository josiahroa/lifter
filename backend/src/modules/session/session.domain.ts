import { UserId } from "@/src/modules/user/user.domain";

export type SessionId = string;

export interface SessionProps {
  userId: UserId;
}

export interface SessionPersistedProps extends SessionProps {
  id: SessionId;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  public readonly userId: UserId;

  // Persisted properties handled by the database
  public readonly id?: SessionId;
  public readonly revokedAt?: Date | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(input: SessionProps & Partial<SessionPersistedProps>) {
    this.userId = input.userId;

    this.id = input.id;
    this.revokedAt = input.revokedAt;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  public static create(input: SessionProps): Session {
    return new Session(input);
  }

  public static rehydrate(input: SessionPersistedProps): Session {
    return new Session(input);
  }
}
