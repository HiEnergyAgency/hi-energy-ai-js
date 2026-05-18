import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Opportunities extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/opportunities", params);
  }
}
