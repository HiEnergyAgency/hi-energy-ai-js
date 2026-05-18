import type { Client } from "./client.js";
import type { QueryParams } from "./paginator.js";
import type { Response } from "./response.js";

export abstract class Resource {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  protected get(path: string, params: QueryParams = {}): Promise<Response> {
    return this.client.get(path, params);
  }

  protected post(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.client.post(path, params, body);
  }

  protected patch(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.client.patch(path, params, body);
  }

  protected delete(path: string, params: QueryParams = {}): Promise<Response> {
    return this.client.delete(path, params);
  }

  protected appGet(path: string, params: QueryParams = {}): Promise<Response> {
    return this.client.appGet(path, params);
  }

  protected appPost(
    path: string,
    params: QueryParams = {},
    body?: unknown,
  ): Promise<Response> {
    return this.client.appPost(path, params, body);
  }
}
