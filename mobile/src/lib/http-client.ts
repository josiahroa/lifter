import type { HttpClient } from "@lifter/http";
import { AxiosHttpClient } from "@lifter/http/clients";

function createHttpClient(): HttpClient {
  return new AxiosHttpClient();
}

/**
 * The default HTTP client for the app. To switch to a different client,
 * it must implement the HttpClient interface and be instantiated here.
 */
export const httpClient = createHttpClient();
