import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import type {
  RequestOTPCodeRequestBody,
  RequestOTPCodeResponseBody,
} from "@lifter/auth";
import { UserService } from "src/user/user.service";
import { User } from "@lifter/db";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async requestOTPCode(
    body: RequestOTPCodeRequestBody
  ): Promise<RequestOTPCodeResponseBody> {
    console.log("requestOTPCode body", body);

    // 1. Get the user from the database, if the user does not exist, create a new user
    let user: User;
    if (body.method === "email") {
      user = await this.userService.getUserByEmail(body.id);
    } else if (body.method === "phone") {
      throw new InternalServerErrorException(
        "Phone number authentication is not supported yet"
      );
      // user = await this.userService.getUserByPhone(body.id);
    } else {
      throw new BadRequestException("Invalid authentication method");
    }
    // 2. Create an OTP code for the user in the auth.OTP table
    // 3. Respond with a success message, indicating that the code has been generated
    console.log("requestOTPCode user", user);
    return Promise.resolve({
      success: true,
      message: "OTP code requested",
    });
  }

  confirmOTPCode(body: any): { success: boolean; message: string } {
    // 1. Check that the user exists in the database, if the user does not exist, return a failure message
    // 2. Check that the OTP code matches the one in the database, if the OTP code does not match, return a failure message
    // 3. Return a JWT token for the user
    console.log(body);
    return {
      success: true,
      message: "OTP code confirmed",
    };
  }
}
