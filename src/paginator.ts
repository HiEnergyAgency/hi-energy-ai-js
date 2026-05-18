import type { Client } from "./client.js";
import { Response } from "./response.js";

export type QueryParams = Record<string, string | number | boolean | undefined>;

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

    while (true) {
      yield response;
      if (!response.hasMore()) break;

      const nextParams = {
        ...this.params,
        ...response.nextPageParams(),
      };
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
