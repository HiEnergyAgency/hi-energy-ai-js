import type { QueryParams } from "../paginator.js";
import { Resource } from "../resource.js";

export class Mcp extends Resource {
  bootstrap(params: QueryParams = {}) {
    return this.appGet("mcp", params);
  }

  integration(params: QueryParams = {}) {
    return this.appGet("mcp/integration.json", params);
  }

  initializeSession(
    options: {
      protocolVersion?: string;
      id?: number | string;
      params?: QueryParams;
    } = {},
  ) {
    const {
      protocolVersion = "2025-11-25",
      id = 1,
      params = {},
    } = options;

    return this.appPost("mcp", params, {
      jsonrpc: "2.0",
      id,
      method: "initialize",
      params: { protocolVersion },
    });
  }

  call(
    method: string,
    options: {
      params?: Record<string, unknown>;
      id?: number | string;
      query?: QueryParams;
    } = {},
  ) {
    const { params = {}, id = 1, query = {} } = options;

    return this.appPost("mcp", query, {
      jsonrpc: "2.0",
      id,
      method,
      params,
    });
  }
}
