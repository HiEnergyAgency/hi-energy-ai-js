import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Domains extends Resource {
  search(domain: string, params: QueryParams = {}) {
    return this.get("/domains/search", { ...params, domain });
  }
}
