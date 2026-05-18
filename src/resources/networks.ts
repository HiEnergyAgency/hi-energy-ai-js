import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Networks extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/networks", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/networks/${id}`, params);
  }
}
