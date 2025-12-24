import type {
  AuthBackend,
  AuthChangeCallback,
  AuthChangeSubscription,
  OTPMethod,
  RequestOTPCodeResponse,
  UserSession,
} from "@lifter/auth";
import { HttpClient } from "@lifter/http";

export class LifterAuthBackend implements AuthBackend {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {
    if (!url) {
      throw new Error("LIFTER_BACKEND_API_URL is not set");
    }
  }

  async signInWithEmail(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ): Promise<UserSession | null> {
    console.log("signInWithEmail() not implemented");
    return null;
  }

  async signInWithOTP(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    method: OTPMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: string
  ): Promise<UserSession | null> {
    console.log("signInWithOTP() not implemented");
    return null;
  }

  async signInWithGoogle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: string
  ): Promise<UserSession | null> {
    console.log("signInWithGoogle() not implemented");
    return null;
  }

  async signInWithApple(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: string
  ): Promise<UserSession | null> {
    console.log("signInWithApple() not implemented");
    return null;
  }

  async signUpWithEmail(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ): Promise<UserSession | null> {
    console.log("signUpWithEmail() not implemented");
    return null;
  }

  async confirmEmail(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: string
  ): Promise<UserSession | null> {
    console.log("confirmEmail() not implemented");
    return null;
  }

  async requestOTPCode(
    method: OTPMethod,
    id: string
  ): Promise<RequestOTPCodeResponse> {
    const response = await this.httpClient.post<RequestOTPCodeResponse>(
      `${this.url}/api/v1/auth/otp/request`,
      {
        method,
        id,
      }
    );
    return response.data;
  }

  async getSession(): Promise<UserSession | null> {
    console.log("getSession() not implemented");
    return null;
  }

  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription {
    console.log("onAuthStateChange() not implemented");
    return {
      id: "123",
      callback,
      unsubscribe: () => {
        console.log("unsubscribe");
      },
    };
  }

  async logout(): Promise<void> {
    console.log("logout() not implemented");
  }
}
