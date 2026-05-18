import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Tags extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/tags", params);
  }

  search(params: QueryParams = {}) {
    return this.list(params);
  }

  advertisers(id: string | number, params: QueryParams = {}) {
    return this.get(`/tags/${id}/advertisers`, params);
  }
}
