import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Deals extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/deals", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/deals/${id}`, params);
  }

  types(params: QueryParams = {}) {
    return this.get("/deals/types", params);
  }

  translate(id: string | number, params: QueryParams = {}) {
    return this.post(`/deals/${id}/translate`, params);
  }
}
