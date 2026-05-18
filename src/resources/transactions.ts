import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Transactions extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/transactions", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/transactions/${id}`, params);
  }
}
