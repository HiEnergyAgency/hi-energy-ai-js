import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Exports extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/exports", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/exports/${id}`, params);
  }

  create(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/exports", params, attributes);
  }
}
