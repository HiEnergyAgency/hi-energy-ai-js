import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Schema extends Resource {
  fetch(params: QueryParams = {}) {
    return this.get("/schema", params);
  }
}
