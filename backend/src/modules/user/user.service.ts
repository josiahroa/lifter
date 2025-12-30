import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { z } from "zod";

import { OTPChannelSchema } from "@lifter/auth";
import { type User } from "@lifter/db";
import { UserRepository } from "@lifter/db/repositories";

export const GetUserOptionalParams = z.object({
  id: z.string(),
  idType: OTPChannelSchema,
});
type GetUserOptionalParams = z.infer<typeof GetUserOptionalParams>;

export const CreateUserParams = z.object({
  id: z.string(),
  idType: OTPChannelSchema,
});
type CreateUserParams = z.infer<typeof CreateUserParams>;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser({ id, idType }: GetUserOptionalParams): Promise<User | null> {
    try {
      if (idType === "email") {
        return await this.userRepository.getUserByEmail(id);
      } else if (idType === "phone") {
        throw new Error("getUserByPhone not implemented");
      }
      throw new Error("Invalid ID type");
    } catch (error) {
      console.error("Error getting user: ", error);
      throw new InternalServerErrorException("Error getting user");
    }
  }

  async createUser({ id, idType }: CreateUserParams): Promise<User> {
    try {
      if (idType === "email") {
        return await this.userRepository.createUser({
          email: id,
          emailVerified: true,
        });
      } else if (idType === "phone") {
        throw new Error("createUserByPhone not implemented");
      }
      throw new Error("Invalid ID type");
    } catch (error) {
      console.error("Error creating user: ", error);
      throw new InternalServerErrorException("Error creating user");
    }
  }
}
