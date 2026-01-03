export type UserId = string;

export interface UserProps {
  email: string;
  emailVerified?: boolean;
}

export interface UserPersistedProps extends UserProps {
  id: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly email: string;
  public readonly emailVerified?: boolean;

  // Persisted properties handled by the database
  public readonly id?: UserId;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(input: UserProps & Partial<UserPersistedProps>) {
    this.email = input.email;
    this.emailVerified = input.emailVerified ?? false;

    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  public static create(input: UserProps): User {
    return new User(input);
  }

  public static rehydrate(input: UserPersistedProps): User {
    return new User(input);
  }
}
