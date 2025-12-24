import {
  HttpClient,
  HttpMethod,
  HttpRequestOptions,
  HttpResponse,
  HttpError,
} from "../types";

/** Represents a recorded request for assertions */
export interface RecordedRequest<TBody = unknown> {
  method: HttpMethod;
  url: string;
  body?: TBody;
  options?: HttpRequestOptions;
  timestamp: number;
}

/** Mock response configuration */
export interface MockResponseConfig<T = unknown> {
  status?: number;
  headers?: Record<string, string>;
  data: T;
}

/** Mock error configuration */
export interface MockErrorConfig {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
  message?: string;
}

interface RequestMatcher {
  method?: HttpMethod | HttpMethod[];
  url: string | RegExp;
}

type MockHandler<T = unknown> =
  | { type: "response"; response: MockResponseConfig<T> }
  | { type: "error"; error: MockErrorConfig }
  | { type: "networkError"; message: string }
  | {
      type: "function";
      fn: (req: RecordedRequest) => Promise<HttpResponse<T>> | HttpResponse<T>;
    };

interface MockEntry {
  matcher: RequestMatcher;
  handler: MockHandler;
  once: boolean;
}

export class TestHttpClient implements HttpClient {
  private mocks: MockEntry[] = [];
  private requests: RecordedRequest[] = [];
  private defaultHandler: MockHandler | null = null;

  /** Reset all mocks and recorded requests */
  reset(): this {
    this.mocks = [];
    this.requests = [];
    this.defaultHandler = null;
    return this;
  }

  /** Clear only recorded requests (keep mocks) */
  clearRequests(): this {
    this.requests = [];
    return this;
  }

  /** Set a default response for unmatched requests */
  setDefaultResponse<T>(response: MockResponseConfig<T> | T): this {
    const config = this.normalizeResponse(response);
    this.defaultHandler = { type: "response", response: config };
    return this;
  }

  /** Set up a mock for a specific method and URL */
  on(method: HttpMethod | HttpMethod[], url: string | RegExp): MockBuilder {
    return new MockBuilder(this, { method, url });
  }

  /** Shorthand for GET requests */
  onGet(url: string | RegExp): MockBuilder {
    return this.on("GET", url);
  }

  /** Shorthand for POST requests */
  onPost(url: string | RegExp): MockBuilder {
    return this.on("POST", url);
  }

  /** Shorthand for PUT requests */
  onPut(url: string | RegExp): MockBuilder {
    return this.on("PUT", url);
  }

  /** Shorthand for PATCH requests */
  onPatch(url: string | RegExp): MockBuilder {
    return this.on("PATCH", url);
  }

  /** Shorthand for DELETE requests */
  onDelete(url: string | RegExp): MockBuilder {
    return this.on("DELETE", url);
  }

  /** Match any method for a URL */
  onAny(url: string | RegExp): MockBuilder {
    return new MockBuilder(this, { url });
  }

  // --- Internal methods for MockBuilder ---
  _addMock(entry: MockEntry): void {
    this.mocks.push(entry);
  }

  // --- Request inspection ---

  /** Get all recorded requests */
  getRequests(): RecordedRequest[] {
    return [...this.requests];
  }

  /** Get requests matching a filter */
  getRequestsMatching(
    method?: HttpMethod,
    urlPattern?: string | RegExp
  ): RecordedRequest[] {
    return this.requests.filter((r) => {
      if (method && r.method !== method) return false;
      if (urlPattern) {
        if (typeof urlPattern === "string" && r.url !== urlPattern)
          return false;
        if (urlPattern instanceof RegExp && !urlPattern.test(r.url))
          return false;
      }
      return true;
    });
  }

  /** Get the last request made */
  getLastRequest(): RecordedRequest | undefined {
    return this.requests[this.requests.length - 1];
  }

  /** Check if a specific request was made */
  wasCalled(method: HttpMethod, urlPattern: string | RegExp): boolean {
    return this.getRequestsMatching(method, urlPattern).length > 0;
  }

  /** Get call count for a specific endpoint */
  getCallCount(method?: HttpMethod, urlPattern?: string | RegExp): number {
    return this.getRequestsMatching(method, urlPattern).length;
  }

  /** Assert a request was made (throws if not) */
  assertCalled(
    method: HttpMethod,
    urlPattern: string | RegExp,
    message?: string
  ): void {
    if (!this.wasCalled(method, urlPattern)) {
      const patternStr =
        urlPattern instanceof RegExp ? urlPattern.toString() : urlPattern;
      throw new Error(
        message ??
          `Expected ${method} ${patternStr} to be called, but it was not`
      );
    }
  }

  /** Assert a request was NOT made (throws if it was) */
  assertNotCalled(
    method: HttpMethod,
    urlPattern: string | RegExp,
    message?: string
  ): void {
    if (this.wasCalled(method, urlPattern)) {
      const patternStr =
        urlPattern instanceof RegExp ? urlPattern.toString() : urlPattern;
      throw new Error(
        message ??
          `Expected ${method} ${patternStr} NOT to be called, but it was`
      );
    }
  }

  // --- HttpClient implementation ---

  async request<TResponse = unknown, TBody = unknown>(
    method: HttpMethod,
    url: string,
    options?: HttpRequestOptions & { body?: TBody }
  ): Promise<HttpResponse<TResponse>> {
    // Record the request
    const recorded: RecordedRequest<TBody> = {
      method,
      url,
      body: options?.body,
      options,
      timestamp: Date.now(),
    };
    this.requests.push(recorded);

    // Find matching mock (first match wins)
    const mockIndex = this.mocks.findIndex((m) =>
      this.matchesRequest(m.matcher, method, url)
    );

    let handler: MockHandler | null = null;

    if (mockIndex >= 0) {
      const mock = this.mocks[mockIndex];
      handler = mock.handler;
      if (mock.once) {
        this.mocks.splice(mockIndex, 1);
      }
    } else if (this.defaultHandler) {
      handler = this.defaultHandler;
    }

    if (!handler) {
      throw new Error(
        `TestHttpClient: No mock found for ${method} ${url}. ` +
          `Set up a mock with client.on("${method}", "${url}").respond(...) or use setDefaultResponse().`
      );
    }

    return this.executeHandler<TResponse>(handler, recorded);
  }

  get<TResponse = unknown>(url: string, options?: HttpRequestOptions) {
    return this.request<TResponse>("GET", url, options);
  }

  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ) {
    return this.request<TResponse, TBody>("POST", url, { ...options, body });
  }

  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ) {
    return this.request<TResponse, TBody>("PUT", url, { ...options, body });
  }

  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ) {
    return this.request<TResponse, TBody>("PATCH", url, { ...options, body });
  }

  delete<TResponse = unknown>(url: string, options?: HttpRequestOptions) {
    return this.request<TResponse>("DELETE", url, options);
  }

  // --- Private helpers ---

  private matchesRequest(
    matcher: RequestMatcher,
    method: HttpMethod,
    url: string
  ): boolean {
    // Check method if specified
    if (matcher.method) {
      const methods = Array.isArray(matcher.method)
        ? matcher.method
        : [matcher.method];
      if (!methods.includes(method)) return false;
    }

    // Check URL
    if (typeof matcher.url === "string") {
      return url === matcher.url || url.endsWith(matcher.url);
    }
    return matcher.url.test(url);
  }

  private async executeHandler<TResponse>(
    handler: MockHandler,
    request: RecordedRequest
  ): Promise<HttpResponse<TResponse>> {
    switch (handler.type) {
      case "response":
        return {
          status: handler.response.status ?? 200,
          headers: handler.response.headers ?? {},
          data: handler.response.data as TResponse,
        };

      case "error":
        throw new HttpError(handler.error.message ?? "Mock HTTP error", {
          status: handler.error.status,
          headers: handler.error.headers,
          body: handler.error.body,
        });

      case "networkError":
        throw new HttpError(handler.message, {
          cause: new Error("Network error"),
        });

      case "function":
        return handler.fn(request) as Promise<HttpResponse<TResponse>>;
    }
  }

  private normalizeResponse<T>(
    response: MockResponseConfig<T> | T
  ): MockResponseConfig<T> {
    if (response && typeof response === "object" && "data" in response) {
      return response as MockResponseConfig<T>;
    }
    return { data: response as T };
  }
}

/** Fluent builder for setting up mocks */
class MockBuilder {
  private isOnce = false;

  constructor(
    private client: TestHttpClient,
    private matcher: RequestMatcher
  ) {}

  /** Only use this mock once, then remove it */
  once(): this {
    this.isOnce = true;
    return this;
  }

  /** Respond with a successful response */
  respond<T>(response: MockResponseConfig<T> | T): TestHttpClient {
    const config = this.normalizeResponse(response);
    this.client._addMock({
      matcher: this.matcher,
      handler: { type: "response", response: config },
      once: this.isOnce,
    });
    return this.client;
  }

  /** Respond using a custom function */
  respondWith<T>(
    fn: (req: RecordedRequest) => Promise<HttpResponse<T>> | HttpResponse<T>
  ): TestHttpClient {
    this.client._addMock({
      matcher: this.matcher,
      handler: { type: "function", fn },
      once: this.isOnce,
    });
    return this.client;
  }

  /** Throw an HTTP error */
  throw(error: MockErrorConfig): TestHttpClient {
    this.client._addMock({
      matcher: this.matcher,
      handler: { type: "error", error },
      once: this.isOnce,
    });
    return this.client;
  }

  /** Throw a network error (no response received) */
  networkError(message = "Network request failed"): TestHttpClient {
    this.client._addMock({
      matcher: this.matcher,
      handler: { type: "networkError", message },
      once: this.isOnce,
    });
    return this.client;
  }

  /** Throw a 400 Bad Request error */
  badRequest(body?: unknown): TestHttpClient {
    return this.throw({ status: 400, body, message: "Bad Request" });
  }

  /** Throw a 401 Unauthorized error */
  unauthorized(body?: unknown): TestHttpClient {
    return this.throw({ status: 401, body, message: "Unauthorized" });
  }

  /** Throw a 403 Forbidden error */
  forbidden(body?: unknown): TestHttpClient {
    return this.throw({ status: 403, body, message: "Forbidden" });
  }

  /** Throw a 404 Not Found error */
  notFound(body?: unknown): TestHttpClient {
    return this.throw({ status: 404, body, message: "Not Found" });
  }

  /** Throw a 500 Internal Server Error */
  serverError(body?: unknown): TestHttpClient {
    return this.throw({ status: 500, body, message: "Internal Server Error" });
  }

  private normalizeResponse<T>(
    response: MockResponseConfig<T> | T
  ): MockResponseConfig<T> {
    if (response && typeof response === "object" && "data" in response) {
      return response as MockResponseConfig<T>;
    }
    return { data: response as T };
  }
}
