import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Tags extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/tags", params);
  }

  /**
   * @deprecated `Tags.search` is an alias for {@link Tags.list} — it hits the
   * same `GET /tags` endpoint with the same parameters. Use `list()` instead.
   * This method will be removed in a future release.
   */
  search(params: QueryParams = {}) {
    return this.list(params);
  }

  advertisers(id: string | number, params: QueryParams = {}) {
    return this.get(`/tags/${id}/advertisers`, params);
  }
}
