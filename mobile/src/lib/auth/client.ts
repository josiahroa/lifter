import { SignInPayload } from ".";
import { SignInStrategyFactory, SignInStrategy } from "./strategies";
import {
  UserSession,
  AuthChangeCallback,
  AuthChangeSubscription,
  AuthBackend,
  SignInMethod,
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
  ): Promise<UserSession> {
    return this.strategies[method].signIn(payload);
  }

  signUpWithEmail(
    email: string,
    password: string
  ): Promise<UserSession | null> {
    return this.backend.signUpWithEmail(email, password);
  }

  confirmEmail(email: string, token: string): Promise<UserSession> {
    return this.backend.confirmEmail(email, token);
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
