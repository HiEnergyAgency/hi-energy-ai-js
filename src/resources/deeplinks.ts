import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Deeplinks extends Resource {
  generate(attributes: Record<string, unknown>, params: QueryParams = {}) {
    return this.post("/deeplinks/generate", params, attributes);
  }
}
