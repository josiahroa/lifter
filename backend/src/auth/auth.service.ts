import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  RequestOTPCodeRequestSchema,
  SignInWithOTPRequestSchema,
  type RequestOTPCodeRequestBody,
  type RequestOTPCodeResponseBody,
  type SignInWithOTPRequestBody,
} from "@lifter/auth";
import { UserService } from "src/user/user.service";
import { User } from "@lifter/db";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService
  ) {}

  async requestOTPCode(
    body: RequestOTPCodeRequestBody
  ): Promise<RequestOTPCodeResponseBody> {
    console.log("requestOTPCode body", body);

    const parsed: RequestOTPCodeRequestBody =
      RequestOTPCodeRequestSchema.parse(body);

    // 1. Get the user from the database, if the user does not exist, create a new user
    let user: User;
    if (parsed.method === "email") {
      user = await this.userService.getUserByEmail(parsed.email);
      if (!user) {
        user = await this.userService.createUserByEmail(parsed.email);
      }
    } else {
      throw new InternalServerErrorException(
        "Phone number authentication is not supported yet"
      );
    }

    // 2. Generate a random 6 digit OTP code, hash it and store it in the cache

    await this.cacheManager.set(
      `otp:${user.id}:${parsed.method}`,
      "123456",
      300000
    );

    return {
      userId: user.id,
      method: parsed.method,
    };
  }

  async confirmOTPCode(
    body: SignInWithOTPRequestBody
  ): Promise<{ success: boolean; message: string }> {
    const parsed: SignInWithOTPRequestBody =
      SignInWithOTPRequestSchema.parse(body);

    const hashedOTPCode = await this.cacheManager.get(
      `otp:${parsed.userId}:${parsed.method}`
    );

    // Check if the OTP code is expired

    // Use the same hashing function as the one used to generate the OTP code
    // Determine if the hashed OTP codes match

    if (hashedOTPCode !== body.rawOTPCode) {
      throw new UnauthorizedException("Invalid OTP code");
    }

    // 3. Return a JWT token for the user
    console.log(body);
    return Promise.resolve({
      success: true,
      message: "OTP code confirmed",
    });
  }
}
