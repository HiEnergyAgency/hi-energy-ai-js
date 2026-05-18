export interface ApiErrorPayload {
  code?: string;
  message?: string;
  request_id?: string;
  details?: unknown;
}

export class HiEnergyError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;
  readonly responseBody?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      requestId?: string;
      details?: unknown;
      responseBody?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "HiEnergyError";
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.details = options.details;
    this.responseBody = options.responseBody;
  }

  static fromResponse(status: number, body: unknown): HiEnergyError {
    const payload = parseJson(body);
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? (payload as { error?: ApiErrorPayload }).error
        : undefined;

    if (error && typeof error === "object") {
      return new HiEnergyError(
        error.message ?? "API request failed",
        {
          status,
          code: error.code,
          requestId: error.request_id,
          details: error.details,
          responseBody: body,
        },
      );
    }

    return new HiEnergyError(`API request failed with status ${status}`, {
      status,
      responseBody: body,
    });
  }
}

function parseJson(body: unknown): unknown {
  if (body === null || body === undefined) return {};
  if (typeof body === "object") return body;
  if (typeof body === "string" && body.trim() === "") return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}
