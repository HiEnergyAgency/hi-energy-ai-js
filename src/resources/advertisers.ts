import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Advertisers extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/advertisers", params);
  }

  find(id: string | number, params: QueryParams = {}) {
    return this.get(`/advertisers/${id}`, params);
  }

  searchByDomain(domain: string, params: QueryParams = {}) {
    return this.get("/advertisers/search_by_domain", { ...params, domain });
  }

  byDomain(domain: string, params: QueryParams = {}) {
    return this.list({ ...params, domain });
  }

  contacts(id: string | number, params: QueryParams = {}) {
    return this.get(`/advertisers/${id}/contacts`, params);
  }

  similar(id: string | number, params: QueryParams = {}) {
    return this.get(`/advertisers/${id}/similar_advertisers`, params);
  }

  related(id: string | number, params: QueryParams = {}) {
    return this.get(`/advertisers/${id}/related_advertisers`, params);
  }

  findMoreContacts(id: string | number, params: QueryParams = {}) {
    return this.post(`/advertisers/${id}/find_more_contacts`, params);
  }
}
