import { VERSION } from "./version.js";

export const PRODUCTION = {
  appOrigin: "https://app.hienergyrocket.com",
  baseUrl: "https://app.hienergyrocket.com/api/v1",
  documentationUrl: "https://app.hienergyrocket.com/api_documentation",
} as const;

export const STAGING = {
  appOrigin: "https://staging.hienergyrocket.com",
  baseUrl: "https://staging.hienergyrocket.com/api/v1",
  documentationUrl: "https://staging.hienergyrocket.com/api_documentation",
} as const;

export const DEFAULT_TIMEOUT = 30_000;

export interface ClientOptions {
  apiKey?: string;
  bearerToken?: string;
  baseUrl?: string;
  appOrigin?: string;
  timeout?: number;
  userAgent?: string;
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
    this.baseUrl = options.baseUrl ?? STAGING.baseUrl;
    this.appOrigin = options.appOrigin ?? STAGING.appOrigin;
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
