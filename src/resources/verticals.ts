import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Verticals extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/verticals", params);
  }
}
