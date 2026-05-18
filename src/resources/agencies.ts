import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Agencies extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/agencies", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/agencies/${id}`, params);
  }
}
