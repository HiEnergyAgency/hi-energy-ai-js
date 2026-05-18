import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Contacts extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/contacts", params);
  }

  create(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/contacts", params, { contact: attributes });
  }

  add(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/contacts/add", params, { contact: attributes });
  }
}
