import type {
  UserSession,
  AuthBackend,
  SignInPayload,
  SignInMethod,
} from "./types";

export interface SignInStrategy<Input> {
  signIn(input: Input): Promise<UserSession | null>;
}

export abstract class BaseSignInStrategy<Input>
  implements SignInStrategy<Input>
{
  constructor(protected readonly backend: AuthBackend) {}

  abstract signIn(input: Input): Promise<UserSession | null>;
}

export class EmailPasswordStrategy extends BaseSignInStrategy<
  SignInPayload["email"]
> {
  signIn(input: SignInPayload["email"]) {
    return this.backend.signInWithEmail(input.email, input.password);
  }
}

export class OTPStrategy extends BaseSignInStrategy<SignInPayload["otp"]> {
  signIn(input: SignInPayload["otp"]) {
    return this.backend.signInWithOTP(input);
  }
}

export class GoogleOAuthStrategy extends BaseSignInStrategy<
  SignInPayload["google"]
> {
  signIn(input: SignInPayload["google"]) {
    return this.backend.signInWithGoogle(input.code);
  }
}

export class AppleOAuthStrategy extends BaseSignInStrategy<
  SignInPayload["apple"]
> {
  signIn(input: SignInPayload["apple"]) {
    return this.backend.signInWithApple(input.code);
  }
}

export interface StrategyFactory {
  createStrategies(backend: AuthBackend): {
    [K in SignInMethod]: SignInStrategy<SignInPayload[K]>;
  };
}

export class SignInStrategyFactory implements StrategyFactory {
  createStrategies(backend: AuthBackend) {
    return {
      email: new EmailPasswordStrategy(backend),
      otp: new OTPStrategy(backend),
      google: new GoogleOAuthStrategy(backend),
      apple: new AppleOAuthStrategy(backend),
    };
  }
}
