import { VERSION } from "./version.js";

export const PRODUCTION = {
  appOrigin: "https://app.hienergy.ai",
  baseUrl: "https://app.hienergy.ai/api/v1",
  documentationUrl: "https://app.hienergy.ai/api_documentation",
} as const;

export const DEFAULT_TIMEOUT = 60_000;

export interface ClientOptions {
  apiKey?: string;
  bearerToken?: string;
  baseUrl?: string;
  appOrigin?: string;
  timeout?: number;
  userAgent?: string;
  /**
   * When `true`, the SDK appends `?dry_run=true` to every outgoing request.
   *
   * Important: this is a *server-side* flag — the HTTP request is still made
   * and your credentials must still be valid. It is not an offline / mock
   * mode. To stub requests in tests, inject a custom `fetch` implementation
   * via the `fetch` option instead.
   */
  dryRun?: boolean;
  fetch?: typeof fetch;
}

export class Configuration {
  apiKey?: string;
  bearerToken?: string;
  baseUrl: string;
  appOrigin: string;
  timeout: number;
  userAgent: string;
  dryRun: boolean;
  fetchImpl: typeof fetch;

  constructor(options: ClientOptions = {}) {
    this.apiKey = options.apiKey;
    this.bearerToken = options.bearerToken;
    this.baseUrl = options.baseUrl ?? PRODUCTION.baseUrl;
    this.appOrigin = options.appOrigin ?? PRODUCTION.appOrigin;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.dryRun = options.dryRun ?? false;
    this.userAgent =
      options.userAgent ??
      `hi-energy-ai/${VERSION} (Node ${typeof process !== "undefined" ? process.version : "unknown"})`;
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  credentialsPresent(): boolean {
    return Boolean(this.apiKey?.length || this.bearerToken?.length);
  }

  clone(): Configuration {
    const copy = new Configuration();
    copy.apiKey = this.apiKey;
    copy.bearerToken = this.bearerToken;
    copy.baseUrl = this.baseUrl;
    copy.appOrigin = this.appOrigin;
    copy.timeout = this.timeout;
    copy.userAgent = this.userAgent;
    copy.dryRun = this.dryRun;
    copy.fetchImpl = this.fetchImpl;
    return copy;
  }
}
