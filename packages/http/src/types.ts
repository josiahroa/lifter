import { z } from "zod";

export const HttpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);
export type HttpMethod = z.infer<typeof HttpMethodSchema>;

export const QueryValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
]);
export type QueryValue = z.infer<typeof QueryValueSchema>;

export const QueryParamsSchema = z.record(
  z.string(),
  z.union([QueryValueSchema, z.array(QueryValueSchema)])
);
export type QueryParams = z.infer<typeof QueryParamsSchema>;

export const HttpRequestOptionsSchema = z.object({
  headers: z.record(z.string(), z.string()).optional(),
  query: QueryParamsSchema.optional(),
  timeoutMs: z.number().optional(),
  signal: z.instanceof(AbortSignal).optional(),
});
export type HttpRequestOptions = z.infer<typeof HttpRequestOptionsSchema>;

export interface HttpResponse<T> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

export class HttpError<TBody = unknown> extends Error {
  public readonly status?: number;
  public readonly headers?: Record<string, string>;
  public readonly body?: TBody;
  public readonly cause?: unknown;

  constructor(message: string, init?: Partial<HttpError<TBody>>) {
    super(message);
    this.name = "HttpError";
    Object.assign(this, init);
  }
}

export interface HttpClient {
  request<TResponse = unknown, TBody = unknown>(
    method: HttpMethod,
    url: string,
    options?: HttpRequestOptions & { body?: TBody }
  ): Promise<HttpResponse<TResponse>>;

  get<TResponse = unknown>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>>;
  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>>;
  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>>;
  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>>;
  delete<TResponse = unknown>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<TResponse>>;
}
