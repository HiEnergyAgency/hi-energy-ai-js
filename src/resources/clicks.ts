import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Clicks extends Resource {
  list(
    startDate: string,
    endDate: string,
    params: QueryParams = {},
  ) {
    return this.get("/clicks", {
      ...params,
      start_date: startDate,
      end_date: endDate,
    });
  }
}
