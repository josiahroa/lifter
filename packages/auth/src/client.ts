import { SignInStrategyFactory, SignInStrategy } from "./strategies";
import type {
  UserSession,
  AuthChangeCallback,
  AuthChangeSubscription,
  AuthBackend,
  SignInMethod,
  RequestOTPCodeResponseBody,
  OTPMethod,
  SignInPayload,
} from "./types";

export class AuthClient {
  private readonly strategies: {
    [K in SignInMethod]: SignInStrategy<SignInPayload[K]>;
  };

  constructor(
    private readonly backend: AuthBackend,
    factory: SignInStrategyFactory
  ) {
    this.strategies = factory.createStrategies(this.backend);
  }

  signIn<K extends SignInMethod>(
    method: K,
    payload: SignInPayload[K]
  ): Promise<UserSession | null> {
    return this.strategies[method].signIn(payload);
  }

  signUpWithEmail(
    email: string,
    password: string
  ): Promise<UserSession | null> {
    return this.backend.signUpWithEmail(email, password);
  }

  confirmEmail(email: string, token: string): Promise<UserSession | null> {
    return this.backend.confirmEmail(email, token);
  }

  requestOTPCode(
    method: OTPMethod,
    id: string
  ): Promise<RequestOTPCodeResponseBody> {
    return this.backend.requestOTPCode({ method, id });
  }

  getSession(): Promise<UserSession | null> {
    return this.backend.getSession();
  }

  onAuthStateChange(callback: AuthChangeCallback): AuthChangeSubscription {
    return this.backend.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  logout(): Promise<void> {
    return this.backend.logout();
  }
}
