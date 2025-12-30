import type { AuthBackend } from "@lifter/auth";
import { AuthClient } from "@lifter/auth";
import { SignInStrategyFactory } from "@lifter/auth/strategies";
import { AxiosHttpClient } from "@lifter/http/clients";

import { LifterAuthBackend } from "./backend/auth";

function createAuthClient(backend: AuthBackend): AuthClient {
  return new AuthClient(backend, new SignInStrategyFactory());
}

/**
 * Create an auth client using a specific implementation of AuthBackend.
 * Exports the AuthClient for the app to use without exposing the backend implementation.
 */
export const auth = createAuthClient(
  new LifterAuthBackend(
    process.env.EXPO_PUBLIC_LIFTER_BACKEND_API_URL ?? "",
    new AxiosHttpClient()
  )
);
