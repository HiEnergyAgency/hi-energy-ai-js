import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Publishers extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/publishers", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/publishers/${id}`, params);
  }

  create(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/publishers", params, { publisher: attributes });
  }

  update(
    id: string | number,
    attributes: Record<string, unknown>,
    params: QueryParams = {},
  ) {
    return this.patch(`/publishers/${id}`, params, { publisher: attributes });
  }

  findLinkedinUsers(id: string | number, params: QueryParams = {}) {
    return this.post(`/publishers/${id}/find_linkedin_users`, params);
  }
}
