import type { Client } from "./client.js";
import { HiEnergyError } from "./error.js";
import { Response } from "./response.js";

export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Hard cap on the number of pages the iterator will fetch before throwing.
 * Guards against backend bugs where `has_more` stays `true` forever, or where
 * the SDK fails to recognise the pagination token a backend emits.
 */
export const MAX_PAGES = 10_000;

export class Paginator implements AsyncIterable<Response> {
  private readonly client: Client;
  private readonly path: string;
  private readonly params: QueryParams;
  private firstResponse?: Response;

  constructor(
    client: Client,
    path: string,
    params: QueryParams = {},
    firstResponse?: Response,
  ) {
    this.client = client;
    this.path = path;
    this.params = params;
    this.firstResponse = firstResponse;
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Response> {
    let response =
      this.firstResponse ?? (await this.client.get(this.path, this.params));
    let pageCount = 0;

    while (true) {
      yield response;
      pageCount += 1;
      if (!response.hasMore()) break;

      const next = response.nextPageParams();
      if (next === null) break;

      if (pageCount >= MAX_PAGES) {
        throw new HiEnergyError(
          `Paginator exceeded ${MAX_PAGES} pages on ${this.path}; aborting to prevent a runaway loop. The server may be returning has_more=true indefinitely.`,
          { code: "PAGINATION_RUNAWAY" },
        );
      }

      const nextParams = { ...this.params, ...next };
      response = await this.client.get(this.path, nextParams);
    }
  }

  async collect(): Promise<Response[]> {
    const pages: Response[] = [];
    for await (const page of this) {
      pages.push(page);
    }
    return pages;
  }
}
