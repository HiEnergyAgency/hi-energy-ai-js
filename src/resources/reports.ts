import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Reports extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/reports", params);
  }

  find(id: string, params: QueryParams = {}) {
    return this.get(`/reports/${id}`, params);
  }
}
