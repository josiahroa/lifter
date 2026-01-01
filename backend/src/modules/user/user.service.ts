import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { User, UserId } from "./user.domain";

import { UserRepository } from "@/src/modules/user/user.repository";

export interface CreateUserInput {
  email: string;
}

export interface CreateUserResult {
  id: UserId;
}

export interface GetUserByIdInput {
  id: UserId;
}

export interface GetUserByEmailInput {
  email: string;
}

export interface CreateVerifiedUserInput {
  email: string;
}

export interface CreateVerifiedUserResult {
  id: UserId;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(input: GetUserByIdInput): Promise<User | null> {
    const user = await this.userRepository.findUserById(input.id);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByEmail(input: GetUserByEmailInput): Promise<User | null> {
    const user = await this.userRepository.findUserByEmail(input.email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(input: CreateUserInput): Promise<CreateUserResult> {
    const user = User.create({ email: input.email });
    const insertedUserId = await this.userRepository.insertUser(user);

    if (!insertedUserId) {
      throw new InternalServerErrorException("Failed to create user");
    }

    return {
      id: insertedUserId,
    };
  }

  /**
   * This method should never be used directly from a controller. Only create users with this method
   * when the sign up process verifies the email.
   */
  async createVerifiedUser(
    input: CreateVerifiedUserInput
  ): Promise<CreateVerifiedUserResult> {
    const user = User.create({ email: input.email, emailVerified: true });
    const insertedUserId = await this.userRepository.insertUser(user);

    if (!insertedUserId) {
      throw new InternalServerErrorException("Failed to create user");
    }

    return {
      id: insertedUserId,
    };
  }
}
