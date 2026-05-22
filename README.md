# hi-energy-ai — Official JavaScript/TypeScript SDK

Official **JavaScript/TypeScript client** for the [Hi Energy API](https://app.hienergy.ai/api_documentation) — affiliate marketing data, coupon deals, advertiser discovery, commissions, click reporting, and MCP integration.

| | |
|---|---|
| **npm** | [`hi-energy-ai`](https://www.npmjs.com/package/hi-energy-ai) |
| **Production API** | `https://app.hienergy.ai/api/v1` |
| **Documentation** | [app.hienergy.ai/api_documentation](https://app.hienergy.ai/api_documentation) |
| **Ruby gem** | [HiEnergyAgency/hi-energy-ai-ruby](https://github.com/HiEnergyAgency/hi-energy-ai-ruby) |

## Installation

```bash
npm install hi-energy-ai
```

**Requirements:** Node.js **18+** (native `fetch`)

## Quick start

1. Sign in at [Hi Energy](https://app.hienergy.ai) and create an API key on the [API Key page](https://app.hienergy.ai/api_documentation/api_key).
2. Install and call the API:

```typescript
import { Client } from "hi-energy-ai";

// Defaults to production (https://app.hienergy.ai/api/v1)
const client = new Client({ apiKey: process.env.HI_ENERGY_API_KEY! });

// Affiliate advertisers
await client.advertisers.list({ limit: 5 });

// Coupon / promo deals
await client.deals.list({ active: true, country: "US" });

// Universal search
await client.search.query("nike", {
  types: "advertisers,deals",
  per_type_limit: 5,
});

// Prebuilt analytics reports
await client.reports.find("top_advertisers_by_sales", {
  period: "last_90_days",
  limit: 10,
});
```

### Custom hosts

If you need to point the SDK at a non-default host (e.g. a regional shard or
a local mock server), override `baseUrl` and `appOrigin` explicitly:

```typescript
import { Client } from "hi-energy-ai";

const client = new Client({
  apiKey: process.env.HI_ENERGY_API_KEY!,
  baseUrl: "https://custom.example.com/api/v1",
  appOrigin: "https://custom.example.com",
});
```

## Authentication

API key (recommended):

```http
X-Api-Key: YOUR_API_KEY
```

```typescript
const client = new Client({ apiKey: "your_integration_key" });
```

OAuth bearer token:

```typescript
const client = new Client({ bearerToken: process.env.AUTH0_ACCESS_TOKEN! });
```

## API resources

Every method maps to the [API playground](https://app.hienergy.ai/api_documentation):

| Client | HTTP | Use case |
|--------|------|----------|
| `search` | `GET /api/v1/search` | Universal search |
| `deals` | `GET /api/v1/deals` | List and filter deals |
| `advertisers` | `GET /api/v1/advertisers` | Advertiser discovery |
| `advertisers.byDomain` | `GET /api/v1/advertisers?domain=…` | Exact-match lookup by domain (sugar for `list({ domain })`) |
| `advertisers.searchByDomain` | `GET .../search_by_domain` | Dedicated lookup endpoint (may do fuzzy / eTLD matching) |
| `contacts` | `GET`, `POST /api/v1/contacts` | Contact search and create |
| `transactions` | `GET /api/v1/transactions` | Sales and commissions |
| `clicks` | `GET /api/v1/clicks` | Click reporting (date range required) |
| `opportunities` | `GET /api/v1/opportunities` | Publisher opportunities |
| `verticals` | `GET /api/v1/verticals` | Industry categories |
| `tags` | `GET /api/v1/tags` | Tags and tagged advertisers |
| `publishers` | CRUD `/api/v1/publishers` | Publisher accounts |
| `agencies` | `GET /api/v1/agencies` | Agency directory |
| `networks` | `GET /api/v1/networks` | Affiliate networks |
| `reports` | `GET /api/v1/reports` | Analytics reports |
| `users` | `/api/v1/users` | User management |
| `statusChanges` | `GET /api/v1/status_changes` | Approval history |
| `deeplinks` | `POST /api/v1/deeplinks/generate` | Tracking links |
| `domains` | `GET /api/v1/domains/search` | Domain search |
| `tools` | `GET /api/v1/tools` | MCP tool catalog |
| `schema` | `GET /api/v1/schema` | OpenAPI download |
| `exports` | `/api/v1/exports` | Async exports |
| `mcp` | `GET`, `POST /mcp` | MCP bootstrap and JSON-RPC |

## Pagination

List responses include `data` and `meta` (`current_page`, `next_page`, `per_page`, `has_more`):

```typescript
for await (const page of client.paginate("/deals", { limit: 50 })) {
  for (const deal of page.data as unknown[]) {
    // process deal
  }
}
```

## Mutation payload envelopes

A few create-style methods wrap your attributes in a resource envelope before
sending; others pass the body through as-is. The current shapes are:

| Method | Wire payload |
|---|---|
| `client.contacts.create({ email })` | `{ "contact": { "email": "…" } }` |
| `client.publishers.create({ name })` | `{ "publisher": { "name": "…" } }` |
| `client.users.create({ email })` | `{ "user": { "email": "…" } }` |
| `client.deeplinks.generate(attrs)` | `attrs` (no envelope) |

You only need to know this if you're inspecting requests on the wire or
mocking `fetch` in tests — the SDK methods themselves take a flat object.

## Dry run

```typescript
const client = new Client({ apiKey: key, dryRun: true });
await client.deals.list({ active: true });
```

`dryRun: true` adds `?dry_run=true` to every outgoing request. It is a
**server-side** flag — the HTTP request is still made and your API key still
needs to be valid. It is **not** an offline / mock mode. To stub the network
entirely in tests, inject a custom `fetch` instead:

```typescript
const client = new Client({ apiKey: "test", fetch: myFakeFetch });
```

## Timeouts

Requests time out after **60 seconds** by default. Override with `timeout`
(milliseconds). On timeout the SDK throws a `HiEnergyError` with
`code: "TIMEOUT"` — there's no need to special-case `AbortError`:

```typescript
import { HiEnergyError } from "hi-energy-ai";

try {
  await client.deals.list({ active: true, country: "US" });
} catch (error) {
  if (error instanceof HiEnergyError && error.code === "TIMEOUT") {
    // consider client.exports for long-running queries
  }
}
```

For genuinely heavy queries, use the async `client.exports` resource instead
of waiting on a synchronous list call.

## MCP and AI agents

MCP routes run on the **app origin** (`appOrigin`), **not** under the API
`baseUrl`. If you set a custom `baseUrl` (e.g. a regional shard) make sure to
also set a matching `appOrigin`, or `client.mcp.*` calls will target the
default host:

```typescript
const client = new Client({
  apiKey: key,
  baseUrl: "https://custom.example.com/api/v1",
  appOrigin: "https://custom.example.com", // required so MCP hits the same host
});

await client.mcp.bootstrap();
await client.mcp.integration();
await client.mcp.initializeSession();
await client.mcp.call("tools/list");
```

## Process-global configuration

`configure({ ... })` mutates a module-level default that every subsequently
constructed `Client` inherits from. It's convenient in scripts but easy to
misuse from tests — prefer passing options directly to `new Client({ ... })`
unless you genuinely want a process-wide default. Per-call options always
override the global.

## Error handling

```typescript
import { HiEnergyError } from "hi-energy-ai";

try {
  await client.advertisers.find(999);
} catch (error) {
  if (error instanceof HiEnergyError) {
    console.error(error.code, error.message, error.requestId, error.status);
  }
}
```

## Contributing

We welcome bug reports, feature requests, and pull requests.

- **Report an issue:** [github.com/HiEnergyAgency/hi-energy-ai-js/issues/new/choose](https://github.com/HiEnergyAgency/hi-energy-ai-js/issues/new/choose)
- **Submit a pull request:** fork the repo, branch from `main`, run `npm test` and `npm run build`, then open a PR — see [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow

---

## Development

```bash
git clone https://github.com/HiEnergyAgency/hi-energy-ai-js.git
cd hi-energy-ai-js
npm install
npm test
npm run build
```

## License

MIT — see [LICENSE](LICENSE).

API access requires a Hi Energy account and API key.
