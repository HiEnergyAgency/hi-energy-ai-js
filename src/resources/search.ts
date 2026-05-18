import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Search extends Resource {
  query(q: string, params: QueryParams = {}) {
    return this.get("/search", { ...params, q });
  }
}
