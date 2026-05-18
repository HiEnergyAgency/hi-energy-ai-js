import { describe, expect, it, vi } from "vitest";
import { Client, HiEnergyError, PRODUCTION, STAGING } from "../src/index.js";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Client", () => {
  const apiKey = "test_api_key";
  const baseUrl = "https://staging.hienergyrocket.com/api/v1";

  it("defaults to staging URLs", () => {
    expect(STAGING.baseUrl).toBe(baseUrl);
    expect(PRODUCTION.appOrigin).toBe("https://app.hienergyrocket.com");
  });

  it("lists advertisers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        data: [{ id: "1", type: "advertiser" }],
        meta: { limit: 25 },
      }),
    );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });
    const response = await client.advertisers.list({ limit: 5 });

    expect(response.success()).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect((response.data as unknown[]).length).toBe(1);

    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe("/api/v1/advertisers");
    expect(url.searchParams.get("limit")).toBe("5");
    expect((init.headers as Headers).get("X-Api-Key")).toBe(apiKey);
  });

  it("fetches a single advertiser", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ data: { id: "42", type: "advertiser" } }),
    );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });
    const response = await client.advertisers.find(42);

    expect((response.data as { id: string }).id).toBe("42");
  });

  it("lists deals with filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ data: [], meta: {} }),
    );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });
    const response = await client.deals.list({ active: true, limit: 10 });

    expect(response.success()).toBe(true);
    const [url] = fetchMock.mock.calls[0] as [URL];
    expect(url.searchParams.get("active")).toBe("true");
    expect(url.searchParams.get("limit")).toBe("10");
  });

  it("runs universal search", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ advertisers: [], deals: [] }),
    );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });
    const response = await client.search.query("nike");

    expect(response.success()).toBe(true);
    const [url] = fetchMock.mock.calls[0] as [URL];
    expect(url.searchParams.get("q")).toBe("nike");
  });

  it("raises HiEnergyError with API error payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "NOT_FOUND",
            message: "Resource not found",
            request_id: "req_123",
          },
        },
        404,
      ),
    );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });

    await expect(client.advertisers.find(999)).rejects.toMatchObject({
      name: "HiEnergyError",
      status: 404,
      code: "NOT_FOUND",
      requestId: "req_123",
    } satisfies Partial<HiEnergyError>);
  });

  it("requires credentials", () => {
    expect(() => new Client()).toThrow(/apiKey or bearerToken/);
  });

  it("appends dry_run when enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: [] }));

    const client = new Client({
      apiKey,
      baseUrl,
      dryRun: true,
      fetch: fetchMock,
    });
    await client.deals.list();

    const [url] = fetchMock.mock.calls[0] as [URL];
    expect(url.searchParams.get("dry_run")).toBe("true");
  });

  it("paginates through pages", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          data: [{ id: "1" }],
          meta: { has_more: true, next_page: 2 },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          data: [{ id: "2" }],
          meta: { has_more: false },
        }),
      );

    const client = new Client({ apiKey, baseUrl, fetch: fetchMock });
    const pages = await client.paginate("/deals", { limit: 1 }).collect();

    expect(pages).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [secondUrl] = fetchMock.mock.calls[1] as [URL];
    expect(secondUrl.searchParams.get("page")).toBe("2");
  });
});
