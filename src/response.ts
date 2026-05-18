export type JsonRecord = Record<string, unknown>;

export class Response<T = unknown> {
  readonly status: number;
  readonly headers: Headers;
  readonly body: T;
  readonly raw: T;
  readonly data: unknown;
  readonly meta: JsonRecord | null;

  constructor(status: number, headers: Headers, body: T) {
    this.status = status;
    this.headers = headers;
    this.body = body;
    this.raw = body;
    this.data = extractData(body);
    this.meta = extractMeta(body);
  }

  success(): boolean {
    return this.status >= 200 && this.status < 300;
  }

  get(key: string): unknown {
    if (this.body && typeof this.body === "object" && !Array.isArray(this.body)) {
      return (this.body as JsonRecord)[key];
    }
    return undefined;
  }

  toJSON(): unknown {
    if (this.body && typeof this.body === "object") return this.body;
    return { data: this.body };
  }

  pagination(): JsonRecord | null {
    if (this.meta && "pagination" in this.meta) {
      return this.meta.pagination as JsonRecord;
    }
    if (this.body && typeof this.body === "object" && !Array.isArray(this.body)) {
      const record = this.body as JsonRecord;
      return (record.pagination as JsonRecord) ?? null;
    }
    return null;
  }

  nextPage(): number | string | null {
    if (!this.meta) return null;
    const page = this.meta.next_page ?? this.meta.nextPage;
    return page === undefined || page === null ? null : (page as number | string);
  }

  hasMore(): boolean {
    if (this.meta && "has_more" in this.meta) {
      return Boolean(this.meta.has_more);
    }
    if (this.meta && "hasMore" in this.meta) {
      return Boolean(this.meta.hasMore);
    }
    return this.nextPage() !== null;
  }

  nextPageParams(): { page: number | string } | null {
    const page = this.nextPage();
    if (page === null) return null;
    return { page };
  }
}

function extractData(body: unknown): unknown {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const record = body as JsonRecord;
    return record.data ?? body;
  }
  return body;
}

function extractMeta(body: unknown): JsonRecord | null {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const record = body as JsonRecord;
    const meta = record.meta;
    return meta && typeof meta === "object" ? (meta as JsonRecord) : null;
  }
  return null;
}
