import {
  Configuration,
  type ClientOptions,
} from "./configuration.js";
import { HiEnergyError } from "./error.js";
import { Paginator, type QueryParams } from "./paginator.js";
import { Response } from "./response.js";
import { Advertisers } from "./resources/advertisers.js";
import { Agencies } from "./resources/agencies.js";
import { Clicks } from "./resources/clicks.js";
import { Contacts } from "./resources/contacts.js";
import { Deals } from "./resources/deals.js";
import { Deeplinks } from "./resources/deeplinks.js";
import { Domains } from "./resources/domains.js";
import { Exports } from "./resources/exports.js";
import { Mcp } from "./resources/mcp.js";
import { Networks } from "./resources/networks.js";
import { Opportunities } from "./resources/opportunities.js";
import { Publishers } from "./resources/publishers.js";
import { Reports } from "./resources/reports.js";
import { Schema } from "./resources/schema.js";
import { Search } from "./resources/search.js";
import { StatusChanges } from "./resources/status_changes.js";
import { Tags } from "./resources/tags.js";
import { Tools } from "./resources/tools.js";
import { Transactions } from "./resources/transactions.js";
import { Users } from "./resources/users.js";
import { Verticals } from "./resources/verticals.js";

export class Client {
  readonly config: Configuration;

  private apiBase?: string;
  private appBase?: string;

  private _advertisers?: Advertisers;
  private _agencies?: Agencies;
  private _clicks?: Clicks;
  private _contacts?: Contacts;
  private _deals?: Deals;
  private _deeplinks?: Deeplinks;
  private _domains?: Domains;
  private _exports?: Exports;
  private _mcp?: Mcp;
  private _networks?: Networks;
  private _opportunities?: Opportunities;
  private _publishers?: Publishers;
  private _reports?: Reports;
  private _schema?: Schema;
  private _search?: Search;
  private _statusChanges?: StatusChanges;
  private _tags?: Tags;
  private _tools?: Tools;
  private _transactions?: Transactions;
  private _users?: Users;
  private _verticals?: Verticals;

  constructor(options: ClientOptions = {}) {
    this.config = globalConfig.clone();
    if (options.apiKey !== undefined) this.config.apiKey = options.apiKey;
    if (options.bearerToken !== undefined) {
      this.config.bearerToken = options.bearerToken;
    }
    if (options.baseUrl !== undefined) this.config.baseUrl = options.baseUrl;
    if (options.appOrigin !== undefined) {
      this.config.appOrigin = options.appOrigin;
    }
    if (options.timeout !== undefined) this.config.timeout = options.timeout;
    if (options.userAgent !== undefined) {
      this.config.userAgent = options.userAgent;
    }
    if (options.dryRun !== undefined) this.config.dryRun = options.dryRun;
    if (options.fetch !== undefined) this.config.fetchImpl = options.fetch;

    if (!this.config.credentialsPresent()) {
      throw new HiEnergyError("apiKey or bearerToken is required", {
        code: "MISSING_CREDENTIALS",
      });
    }
  }

  get advertisers(): Advertisers {
    return (this._advertisers ??= new Advertisers(this));
  }

  get agencies(): Agencies {
    return (this._agencies ??= new Agencies(this));
  }

  get clicks(): Clicks {
    return (this._clicks ??= new Clicks(this));
  }

  get contacts(): Contacts {
    return (this._contacts ??= new Contacts(this));
  }

  get deals(): Deals {
    return (this._deals ??= new Deals(this));
  }

  get deeplinks(): Deeplinks {
    return (this._deeplinks ??= new Deeplinks(this));
  }

  get domains(): Domains {
    return (this._domains ??= new Domains(this));
  }

  get exports(): Exports {
    return (this._exports ??= new Exports(this));
  }

  get mcp(): Mcp {
    return (this._mcp ??= new Mcp(this));
  }

  get networks(): Networks {
    return (this._networks ??= new Networks(this));
  }

  get opportunities(): Opportunities {
    return (this._opportunities ??= new Opportunities(this));
  }

  get publishers(): Publishers {
    return (this._publishers ??= new Publishers(this));
  }

  get reports(): Reports {
    return (this._reports ??= new Reports(this));
  }

  get schema(): Schema {
    return (this._schema ??= new Schema(this));
  }

  get search(): Search {
    return (this._search ??= new Search(this));
  }

  get statusChanges(): StatusChanges {
    return (this._statusChanges ??= new StatusChanges(this));
  }

  get tags(): Tags {
    return (this._tags ??= new Tags(this));
  }

  get tools(): Tools {
    return (this._tools ??= new Tools(this));
  }

  get transactions(): Transactions {
    return (this._transactions ??= new Transactions(this));
  }

  get users(): Users {
    return (this._users ??= new Users(this));
  }

  get verticals(): Verticals {
    return (this._verticals ??= new Verticals(this));
  }

  get(
    path: string,
    params: QueryParams = {},
  ): Promise<Response> {
    return this.request("GET", path, params);
  }

  post(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.request("POST", path, params, body);
  }

  patch(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.request("PATCH", path, params, body);
  }

  delete(path: string, params: QueryParams = {}): Promise<Response> {
    return this.request("DELETE", path, params);
  }

  appGet(path: string, params: QueryParams = {}): Promise<Response> {
    return this.appRequest("GET", path, params);
  }

  appPost(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.appRequest("POST", path, params, body);
  }

  paginate(path: string, params: QueryParams = {}): Paginator {
    return new Paginator(this, normalizePath(path), params);
  }

  private request(
    method: string,
    path: string,
    params: QueryParams,
    body?: unknown,
  ): Promise<Response> {
    return this.performRequest(this.apiBaseUrl(), method, path, params, body);
  }

  private appRequest(
    method: string,
    path: string,
    params: QueryParams,
    body?: unknown,
  ): Promise<Response> {
    return this.performRequest(this.appBaseUrl(), method, path, params, body);
  }

  private async performRequest(
    base: string,
    method: string,
    path: string,
    params: QueryParams,
    body?: unknown,
  ): Promise<Response> {
    const url = new URL(normalizePath(path), base.endsWith("/") ? base : `${base}/`);
    const query = compactParams(params, this.config.dryRun);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const headers = new Headers({
      Accept: "application/json",
      "User-Agent": this.config.userAgent,
    });

    if (this.config.apiKey) {
      headers.set("X-Api-Key", this.config.apiKey);
    } else if (this.config.bearerToken) {
      headers.set("Authorization", `Bearer ${this.config.bearerToken}`);
    }

    const init: RequestInit = { method, headers };
    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
      init.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);
    init.signal = controller.signal;

    try {
      const response = await this.config.fetchImpl(url, init);
      const parsed = await parseBody(response);
      if (response.ok) {
        return new Response(response.status, response.headers, parsed);
      }
      throw HiEnergyError.fromResponse(response.status, parsed);
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || err.name === "TimeoutError")
      ) {
        throw new HiEnergyError(
          `Request to ${url.toString()} timed out after ${this.config.timeout}ms. For long-running queries consider client.exports (async exports).`,
          { code: "TIMEOUT" },
        );
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  private apiBaseUrl(): string {
    if (!this.apiBase) {
      this.apiBase = this.config.baseUrl.endsWith("/")
        ? this.config.baseUrl
        : `${this.config.baseUrl}/`;
    }
    return this.apiBase;
  }

  private appBaseUrl(): string {
    if (!this.appBase) {
      this.appBase = this.config.appOrigin.endsWith("/")
        ? this.config.appOrigin
        : `${this.config.appOrigin}/`;
    }
    return this.appBase;
  }
}

let globalConfig = new Configuration();

/**
 * Replace the process-wide default Configuration used as the starting point
 * for every subsequently constructed {@link Client}.
 *
 * NOTE: this mutates **module-level** state. Every `new Client({})` created
 * after this call inherits the new defaults (the per-call options passed to
 * the constructor still take precedence). Prefer passing options directly to
 * `new Client({ ... })` unless you genuinely want a process-global default,
 * e.g. in a small script. In tests, remember to reset by calling
 * `configure({})` again at the end of the suite.
 */
export function configure(options: ClientOptions): Configuration {
  globalConfig = new Configuration(options);
  return globalConfig;
}

function normalizePath(path: string): string {
  return path.replace(/^\//, "");
}

function compactParams(
  params: QueryParams,
  dryRun: boolean,
): QueryParams {
  const result: QueryParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  if (dryRun && result.dry_run === undefined && result.dryRun === undefined) {
    result.dry_run = true;
  }
  return result;
}

async function parseBody(response: globalThis.Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
