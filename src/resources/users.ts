import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Users extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/users", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/users/${id}`, params);
  }

  create(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/users", params, { user: attributes });
  }

  update(
    id: string | number,
    attributes: Record<string, unknown>,
    params: QueryParams = {},
  ) {
    return this.patch(`/users/${id}`, params, { user: attributes });
  }

  resendInvitation(id: string | number, params: QueryParams = {}) {
    return this.post(`/users/${id}/resend_invitation`, params);
  }

  rotateApiKey(id: string | number, params: QueryParams = {}) {
    return this.post(`/users/${id}/rotate_api_key`, params);
  }
}
