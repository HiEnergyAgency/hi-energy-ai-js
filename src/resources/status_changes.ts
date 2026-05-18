import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class StatusChanges extends Resource {
  list(params: QueryParams = {}) {
    return this.get("/status_changes", params);
  }
}
