import axios, { AxiosInstance, AxiosError } from "axios";

import { HttpError } from "../types";

import type {
  HttpClient,
  HttpMethod,
  HttpRequestOptions,
  HttpResponse,
} from "../types";

function normalizeHeaders(headers: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers || typeof headers !== "object") return out;

  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    if (v == null) continue;
    out[k.toLowerCase()] = Array.isArray(v) ? v.join(",") : String(v);
  }
  return out;
}

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(client?: AxiosInstance) {
    this.client = client ?? axios.create();
  }

  async request<TResponse = unknown, TBody = unknown>(
    method: HttpMethod,
    url: string,
    options?: HttpRequestOptions & { body?: TBody }
  ): Promise<HttpResponse<TResponse>> {
    try {
      const res = await this.client.request<TResponse>({
        method,
        url,
        data: options?.body,
        headers: options?.headers,
        params: options?.query,
        timeout: options?.timeoutMs,
        signal: options?.signal,
      });

      return {
        status: res.status,
        headers: normalizeHeaders(res.headers),
        data: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError;
        throw new HttpError("HTTP request failed", {
          status: ax.response?.status,
          headers: normalizeHeaders(ax.response?.headers),
          body: ax.response?.data,
          cause: err,
        });
      }
      throw new HttpError("HTTP request failed", { cause: err });
    }
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
}
