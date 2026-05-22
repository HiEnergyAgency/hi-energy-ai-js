export { VERSION } from "./version.js";
export {
  Configuration,
  PRODUCTION,
  DEFAULT_TIMEOUT,
  type ClientOptions,
} from "./configuration.js";
export { HiEnergyError, type ApiErrorPayload } from "./error.js";
export { Response } from "./response.js";
export { Paginator, type QueryParams } from "./paginator.js";
export { Client, configure } from "./client.js";

import { Client } from "./client.js";
import { PRODUCTION } from "./configuration.js";

export function createClient(
  apiKey: string,
  options: Omit<import("./configuration.js").ClientOptions, "apiKey"> = {},
): Client {
  return new Client({ apiKey, ...options });
}

export const documentationUrl = PRODUCTION.documentationUrl;
