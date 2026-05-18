import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Tools extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/tools", params);
  }
}
